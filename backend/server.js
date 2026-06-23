require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

// Import routes
const authRoutes = require('./api/routes/auth');
const teamsRoutes = require('./api/routes/teams');
const playersRoutes = require('./api/routes/players');
const tournamentsRoutes = require('./api/routes/tournaments');
const matchesRoutes = require('./api/routes/matches');
const statsRoutes = require('./api/routes/stats');
const adminRoutes = require('./api/routes/admin');
const chatRoutes = require('./api/routes/chat');
const aiRoutes = require('./api/routes/ai');

const { User, Session, Team, Player, Tournament, TournamentMatch, ChatMessage, Prediction } = require('./models');
const { authenticate, requireAdmin, requireManagerOrAdmin, generateToken } = require('./middleware');

const app = express();
const server = http.createServer(app);

// ==================== CORS & MIDDLEWARE ====================
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://cricket-hub-y63h.vercel.app',
  process.env.FRONTEND_URL,
  process.env.RENDER_EXTERNAL_URL, // auto-set by Render to this service's public URL
].filter(Boolean);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  // Monolith deploy: allow any Render subdomain (URL can change between deploys)
  if (/^https:\/\/[\w-]+\.onrender\.com$/.test(origin)) return true;
  return false;
};

app.use(cors({
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ensure preflight requests are handled
app.options('*', cors());

app.use(express.json());

// Cookie parser middleware
app.use((req, res, next) => {
  const cookieHeader = req.headers.cookie;
  req.cookies = {};
  if (cookieHeader) {
    cookieHeader.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      req.cookies[name] = value;
    });
  }
  next();
});

// ==================== DATABASE ====================
const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME || 'cricket_league';

function buildMongoUri() {
  if (!MONGO_URL) {
    console.error('MONGO_URL environment variable is not set');
    return null;
  }
  const trimmed = MONGO_URL.replace(/\/$/, '');
  // Atlas URIs often include ?retryWrites=... — only treat path segment before ? as DB name
  const hasDbInPath = /mongodb(\+srv)?:\/\/[^/]+\/[^/?]+/.test(trimmed);
  if (hasDbInPath) return trimmed;
  return `${trimmed}/${DB_NAME}`;
}

const mongoUri = buildMongoUri();
if (mongoUri) {
  mongoose.connect(mongoUri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// ==================== SOCKET.IO ====================
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      callback(null, false);
    },
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  },
  transports: ['websocket', 'polling']
});

const activeUsers = new Map();
const liveScoreViewers = new Map();

// Broadcast functions
const broadcastScoreUpdate = (matchId, tournamentId, matchData) => {
  io.to(`match_${matchId}`).emit('score_update', matchData);
  if (tournamentId) {
    io.to(`tournament_${tournamentId}`).emit('match_update', matchData);
  }
};

const broadcastTournamentUpdate = (tournamentId, data) => {
  io.to(`tournament_${tournamentId}`).emit('tournament_update', data);
};

// Pass broadcast functions to routes
tournamentsRoutes.setBroadcastFunctions(broadcastScoreUpdate, broadcastTournamentUpdate);
matchesRoutes.setBroadcastFunctions(broadcastScoreUpdate, broadcastTournamentUpdate);

// Socket.IO handlers
io.on('connection', (socket) => {


  // Join match room for live chat
  socket.on('join_match', async ({ match_id, user }) => {
    socket.join(`match_${match_id}`);
    socket.matchId = match_id;
    socket.user = user;

    if (!activeUsers.has(match_id)) {
      activeUsers.set(match_id, new Set());
    }
    activeUsers.get(match_id).add(user?.name || 'Anonymous');

    try {
      const recentMessages = await ChatMessage.find({ match_id })
        .sort({ created_at: -1 })
        .limit(50)
        .select('-_id -__v');

      socket.emit('recent_messages', recentMessages.reverse());
      io.to(`match_${match_id}`).emit('viewer_count', activeUsers.get(match_id).size);
    } catch (error) {
      // Silent error handling
    }
  });

  // Join tournament room
  socket.on('join_tournament', ({ tournament_id, user }) => {
    socket.join(`tournament_${tournament_id}`);
    socket.tournamentId = tournament_id;

    if (!liveScoreViewers.has(tournament_id)) {
      liveScoreViewers.set(tournament_id, new Set());
    }
    liveScoreViewers.get(tournament_id).add(socket.id);

    const viewerCount = liveScoreViewers.get(tournament_id).size;
    io.to(`tournament_${tournament_id}`).emit('tournament_viewer_count', viewerCount);
  });

  // Send chat message
  socket.on('send_message', async ({ match_id, message, user }) => {
    try {
      const messageId = uuidv4();
      const msg = new ChatMessage({
        message_id: messageId,
        match_id,
        user_name: user?.name || 'Anonymous',
        user_id: user?.user_id || 'anonymous',
        user_picture: user?.picture || null,
        message,
        created_at: new Date()
      });
      await msg.save();

      io.to(`match_${match_id}`).emit('new_message', {
        message_id: messageId,
        user_name: user?.name || 'Anonymous',
        user_id: user?.user_id || 'anonymous',
        user_picture: user?.picture || null,
        message,
        created_at: msg.created_at
      });
    } catch (error) {
      socket.emit('chat_error', { error: 'Failed to send message' });
    }
  });

  // Leave rooms
  socket.on('leave_match', ({ match_id }) => {
    socket.leave(`match_${match_id}`);
    if (activeUsers.has(match_id) && socket.user) {
      activeUsers.get(match_id).delete(socket.user?.name || 'Anonymous');
    }
  });

  socket.on('leave_tournament', ({ tournament_id }) => {
    socket.leave(`tournament_${tournament_id}`);
    if (liveScoreViewers.has(tournament_id)) {
      liveScoreViewers.get(tournament_id).delete(socket.id);
    }
  });

  socket.on('disconnect', () => {
    if (socket.matchId && activeUsers.has(socket.matchId) && socket.user) {
      activeUsers.get(socket.matchId).delete(socket.user?.name || 'Anonymous');
    }
    if (socket.tournamentId && liveScoreViewers.has(socket.tournamentId)) {
      liveScoreViewers.get(socket.tournamentId).delete(socket.id);
    }
  });
});

// ==================== API ROUTES ====================

// Health check
app.get('/api/', (req, res) => {
  res.json({ message: 'Cricket League Management System API', version: '2.0.0' });
});

app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/tournaments', tournamentsRoutes);
app.use('/api/tournament-matches', matchesRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);

// Compatibility route for old /api/matches endpoints
app.get('/api/matches/live', async (req, res) => {
  try {
    const matches = await TournamentMatch.find({ status: 'live' })
      .sort({ scheduled_time: -1 })
      .select('-_id -__v');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch live matches' });
  }
});

app.get('/api/matches/upcoming', async (req, res) => {
  try {
    const matches = await TournamentMatch.find({
      status: { $in: ['scheduled', 'pending'] }
    })
      .sort({ scheduled_time: 1 })
      .limit(10)
      .select('-_id -__v');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ detail: 'Failed to fetch upcoming matches' });
  }
});

// ==================== SERVE REACT FRONTEND ====================
const frontendBuildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuildPath));

// Catch-all: send React app for any non-API route (React Router support)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// ==================== SERVER ====================
const PORT = process.env.PORT || 8001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
