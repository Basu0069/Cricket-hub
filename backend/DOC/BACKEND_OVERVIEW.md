# Cricket Hub Backend - Complete Overview

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Core Concepts](#core-concepts)
5. [Data Models](#data-models)
6. [Authentication & Authorization](#authentication--authorization)
7. [Real-time Features](#real-time-features)
8. [Getting Started](#getting-started)

---

## 🏗️ Architecture Overview

The Cricket Hub backend follows a **Node.js + Express + MongoDB** architecture with real-time capabilities using Socket.IO.

### High-Level Flow

```
Frontend (React)
    ↓
CORS-Enabled Express Server
    ├── REST APIs (Routes)
    ├── Authentication (JWT/Sessions)
    ├── Real-time Communication (Socket.IO)
    └── Database Layer (MongoDB)
```

### Key Responsibilities

| Component | Purpose |
|-----------|---------|
| **Express App** | HTTP server handling all API requests |
| **MongoDB** | Persistent data storage for users, teams, matches, tournaments |
| **Socket.IO** | Real-time updates for live scores, chat messages |
| **JWT/Sessions** | Authentication and authorization |
| **Gemini AI** | AI-powered player performance predictions |

---

## 💻 Technology Stack

```json
{
  "runtime": "Node.js",
  "framework": "Express.js v4.18.2",
  "database": "MongoDB v8.0.0",
  "authentication": "JWT + bcryptjs",
  "real-time": "Socket.IO v4.7.2",
  "ai-service": "Google Gemini API",
  "utilities": ["axios", "uuid", "dotenv"]
}
```

---

## 📁 Project Structure

```
backend/
├── server.js                 # Main server entry point
├── models.js                 # MongoDB schemas (User, Team, Player, etc.)
├── middleware.js             # Authentication & authorization logic
├── package.json              # Dependencies
├── .env                       # Environment variables
├── api/
│   └── routes/
│       ├── auth.js           # User authentication endpoints
│       ├── teams.js          # Team management endpoints
│       ├── players.js        # Player management endpoints
│       ├── tournaments.js    # Tournament creation & management
│       ├── matches.js        # Match-related operations
│       ├── stats.js          # Statistics & leaderboards
│       ├── admin.js          # Admin-only operations
│       ├── chat.js           # Chat message retrieval
│       └── ai.js             # AI predictions
└── README.md                 # Basic setup guide
```

---

## 🎯 Core Concepts

### 1. **User Roles**

The system supports three user roles with different permissions:

```
Spectator
├── View teams, players, tournaments
├── View live scores & statistics
└── Send chat messages during matches

Manager
├── All Spectator permissions
├── Create and manage teams
├── Add/remove/update players
├── Create tournaments
├── Start matches & update scores
└── View their own tournaments

Admin
└── All permissions (complete system access)
    ├── Manage all users & roles
    ├── Delete any team/tournament/player
    ├── Seed database with sample data
    └── Full system control
```

### 2. **Authentication Flow**

```
User Registration/Login
         ↓
Generate JWT Token
         ↓
Token stored by Frontend (localStorage/cookies)
         ↓
Token included in API requests (Headers/Cookies)
         ↓
Backend validates JWT
         ↓
Request processed with user context
```

### 3. **Tournament Lifecycle**

```
1. DRAFT
   - Manager creates tournament
   - Add teams to tournament
   - Configure settings (format, overs, start date)

2. UPCOMING
   - Status changes to 'upcoming'
   - Bracket generated (knockout/round-robin)
   - Matches scheduled

3. LIVE
   - Tournament has active matches
   - Real-time score updates via Socket.IO
   - Chat enabled for live matches

4. COMPLETED
   - All matches finished
   - Winner determined
   - Statistics finalized
```

### 4. **Match Lifecycle**

```
PENDING/SCHEDULED → START → LIVE → INNINGS 2 → COMPLETED → DECIDED
                            ↓
                    Toss & Innings Selection
```

---

## 📊 Data Models

### User Schema
```javascript
{
  user_id: "user_abc123",           // Unique identifier
  email: "user@example.com",        // Unique email
  name: "John Doe",                 // User's name
  password_hash: "hashed_pwd",      // Bcrypt hashed password
  role: "spectator|manager|admin",  // User role
  picture: "url",                   // Profile picture URL
  team_id: "team_xyz",              // Associated team (if manager)
  created_at: Date
}
```

### Team Schema
```javascript
{
  team_id: "team_abc123",
  name: "Mumbai Indians",
  short_name: "MI",
  logo_url: "url",
  primary_color: "#004BA0",
  secondary_color: "#18181b",
  home_ground: "Wankhede Stadium",
  manager_id: "user_xyz",           // Manager who created the team
  matches_played: 10,
  matches_won: 7,
  matches_lost: 2,
  matches_drawn: 1,
  points: 15,                       // Tournament points
  net_run_rate: 1.35,              // NRR for standings
  created_at: Date
}
```

### Player Schema
```javascript
{
  player_id: "player_abc123",
  name: "Virat Kohli",
  email: "player@example.com",
  team_id: "team_xyz",              // Which team
  jersey_number: 18,
  role: "batsman|bowler|all-rounder|wicket-keeper",
  batting_style: "right-handed|left-handed",
  bowling_style: "fast|spin|medium",
  profile_picture: "url",

  // Career Statistics
  matches: 50,
  runs: 2500,
  balls_faced: 2100,
  fours: 200,
  sixes: 50,
  highest_score: 120,
  fifties: 15,
  hundreds: 5,
  wickets: 0,
  balls_bowled: 0,
  runs_conceded: 0,
  best_bowling: "0/0",
  catches: 35,
  stumpings: 0,
  run_outs: 2,

  created_at: Date
}
```

### Tournament Schema
```javascript
{
  tournament_id: "tourn_abc123",
  name: "ICC Cricket League 2024",
  sport_type: "cricket|football",
  format: "knockout|round-robin|group-knockout",
  status: "draft|upcoming|live|completed",
  teams: ["team_1", "team_2", ...],  // Array of team IDs
  created_by: "user_manager_id",
  start_date: Date,
  end_date: Date,
  venue: "Mumbai, India",
  overs: 20,                        // Overs per innings
  match_interval_hours: 24,         // Time between matches
  bracket_data: { ... },            // Bracket structure
  current_round: 1,
  winner_id: "team_xyz",            // Final winner
  created_at: Date
}
```

### Tournament Match Schema
```javascript
{
  match_id: "match_abc123",
  tournament_id: "tourn_xyz",
  round: 1,
  match_number: 1,
  team1_id: "team_1",
  team2_id: "team_2",
  venue: "Mumbai",
  scheduled_time: Date,
  status: "pending|scheduled|live|completed",
  toss_winner: "team_1",
  toss_decision: "bat|bowl",

  // Innings 1 Data
  innings1: {
    batting_team_id: "team_1",
    runs: 150,
    wickets: 7,
    overs: 20,
    extras: 12,
    status: "completed|in_progress"
  },

  // Innings 2 Data
  innings2: {
    batting_team_id: "team_2",
    runs: 145,
    wickets: 8,
    overs: 19,
    extras: 8,
    status: "completed|in_progress"
  },

  winner_id: "team_1",
  man_of_match: "player_xyz",

  created_at: Date
}
```

### Chat Message Schema
```javascript
{
  match_id: "match_abc123",
  user_name: "John Doe",
  user_id: "user_xyz",
  message: "Great shot!",
  created_at: Date
}
```

### Prediction Schema
```javascript
{
  prediction_id: "pred_abc123",
  player_id: "player_xyz",
  prediction_text: "Virat will score 45-60 runs with 2 boundaries",
  created_at: Date
}
```

---

## 🔐 Authentication & Authorization

### How Authentication Works

1. **User Registration/Login**
   - User provides credentials (email, password)
   - Backend hashes password with bcryptjs
   - JWT token generated and returned to frontend
   - Frontend stores token locally

2. **Request Authorization**
   - Frontend includes JWT in Authorization header: `Bearer <token>`
   - OR token stored in cookies and automatically sent
   - Backend middleware verifies JWT signature
   - Request proceeds with authenticated user context

3. **Protected Routes**
   - Routes decorated with `authenticate` middleware check token validity
   - Routes with `requireManagerOrAdmin` ensure user is manager or admin
   - Routes with `requireAdmin` ensure user is admin only

### Middleware Flow

```javascript
// Example: Create a team (requires authentication + manager/admin role)
router.post('/', authenticate, requireManagerOrAdmin, async (req, res) => {
  // authenticate middleware: Validates JWT/session
  // requireManagerOrAdmin middleware: Checks user.role
  // Handler: Create team with req.user context
});
```

### JWT Token Structure

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZ...
  ↓                      ↓                      ↓
Header              Payload               Signature

Payload Contains:
{
  "user_id": "user_abc123",
  "email": "user@example.com",
  "role": "manager",
  "iat": 1704067200,
  "exp": 1704153600
}
```

---

## 🔄 Real-time Features (Socket.IO)

### Connection Management

When a user connects via Socket.IO:

```javascript
// User joins a match room
socket.on('join_match', ({ match_id, user }) => {
  socket.join(`match_${match_id}`);  // Join Socket.IO room
  // Recent chat messages sent to user
  // User count updated for all viewers
});
```

### Real-time Events

| Event | Emitter | Receivers | Payload |
|-------|---------|-----------|---------|
| `score_update` | Backend (API) | All viewers in `match_${matchId}` room | Match object with updated scores |
| `new_message` | User | All viewers in `match_${matchId}` room | Chat message object |
| `viewer_count` | Backend | All viewers in `match_${matchId}` room | Count of active viewers |
| `tournament_update` | Backend (API) | All viewers in `tournament_${tournamentId}` room | Tournament object |
| `recent_messages` | Backend (Socket) | Connecting user | Array of last 50 messages |

### Broadcasting Architecture

```javascript
// When a score is updated via API
router.put('/:matchId/score', async (req, res) => {
  // Update database
  const updatedMatch = await TournamentMatch.findOneAndUpdate(...);

  // Broadcast to all connected viewers
  broadcastScoreUpdate(matchId, tournamentId, updatedMatch);
  // ├── Emits 'score_update' to match_${matchId} room
  // └── Emits 'match_update' to tournament_${tournamentId} room
});
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 8.0+
- Google Gemini API Key (for AI predictions)

### Installation & Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment**
   ```bash
   # Create .env file
   cat > .env << EOF
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=cricket_league
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRATION=24h
   FRONTEND_URL=http://localhost:3000
   GEMINI_API_KEY=your_gemini_api_key
   PORT=5000
   EOF
   ```

3. **Start MongoDB**
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community

   # Or locally
   mongod
   ```

4. **Start Backend Server**
   ```bash
   npm run dev        # Development with nodemon
   # OR
   npm start          # Production
   ```

5. **Verify Server is Running**
   ```bash
   curl http://localhost:5000/api/teams
   ```

### Seeding Sample Data

```bash
# As an admin user, call the seed endpoint
POST http://localhost:5000/api/admin/seed-data
Header: Authorization: Bearer <admin_jwt_token>

# Creates 8 sample cricket teams
```

---

## 📡 API Communication Pattern

### REST API Pattern

```
Method: POST
URL: http://localhost:5000/api/teams
Headers: {
  "Content-Type": "application/json",
  "Authorization": "Bearer <jwt_token>"
}
Body: {
  "name": "Mumbai Indians",
  "short_name": "MI",
  ...
}
Response: {
  "team_id": "team_abc123",
  "name": "Mumbai Indians",
  ...
}
```

### Error Responses

```javascript
// Authentication Error
{
  "detail": "Not authenticated",
  status: 401
}

// Authorization Error
{
  "detail": "Admin access required",
  status: 403
}

// Not Found
{
  "detail": "Team not found",
  status: 404
}

// Validation Error
{
  "detail": "Failed to create team",
  status: 500
}
```

---

## 🔄 Example Flow: Creating Tournament & Starting Match

### Step 1: Manager Creates Tournament
```bash
POST /api/tournaments
{
  "name": "IPL 2024",
  "format": "knockout",
  "teams": ["team_1", "team_2", "team_3", "team_4"],
  "start_date": "2024-01-15",
  "venue": "Mumbai"
}
→ Returns tournament_id
```

### Step 2: Generate Bracket
```bash
POST /api/tournaments/{tournamentId}/generate-bracket
→ Creates 4 matches for first round
→ Bracket structure stored
→ Tournament status: 'upcoming'
```

### Step 3: Start Match
```bash
POST /api/matches/{matchId}/start
{
  "toss_winner": "team_1",
  "toss_decision": "bat"
}
→ Match status: 'live'
→ Socket.IO broadcasts 'match_update' event
→ All connected viewers notified
```

### Step 4: Update Score (Real-time)
```bash
PUT /api/matches/{matchId}/score
{
  "innings": 1,
  "runs": 85,
  "wickets": 3,
  "overs": 12
}
→ Match updated in DB
→ Socket.IO broadcasts 'score_update'
→ Connected viewers receive real-time update
```

### Step 5: Complete Match & Advance Winner
```bash
POST /api/matches/{matchId}/complete
{
  "winner_id": "team_1",
  "man_of_match": "player_xyz"
}
→ Match marked as 'completed'
→ Team stats updated
→ Next round match created if applicable
```

---

## 🛡️ Security Considerations

1. **Password Hashing**: All passwords hashed with bcryptjs (10 rounds)
2. **JWT Expiration**: Tokens expire after configured duration (default 24h)
3. **CORS Policy**: Restricted to whitelisted origins
4. **Role-Based Access**: All sensitive operations require appropriate role
5. **Middleware Stack**: All routes protected with appropriate middleware
6. **Environment Variables**: Sensitive config never in code

---

## 📊 Key Statistics Calculations

### Batting Statistics
- **Average**: `runs / matches`
- **Strike Rate**: `(runs / balls_faced) * 100`
- **Consistency**: Fifties & Hundreds tracking

### Bowling Statistics
- **Bowling Average**: `runs_conceded / wickets`
- **Economy Rate**: `(runs_conceded / (balls_bowled / 6))`
- **Performance Tracking**: Best bowling figures

### Team Standings
- **Points**: Win = 2 points, Draw = 1 point, Loss = 0 points
- **Net Run Rate (NRR)**: `(runs_for / overs_for) - (runs_against / overs_against)`
- **Ranking**: Points → NRR → Head-to-head

---

## 🤖 AI Integration (Gemini)

### Player Prediction Endpoint

```bash
GET /api/ai/predict/{playerId}
Header: Authorization: Bearer <token>

Response: {
  "prediction_id": "pred_abc123",
  "player_id": "player_xyz",
  "player_name": "Virat Kohli",
  "prediction_text": "Based on career statistics, Virat is likely to score 45-65 runs in T20 format...",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### How It Works
1. Fetch player statistics from database
2. Generate prompt with player data
3. Send to Google Gemini API
4. Return AI-generated prediction
5. Store prediction in database for history

---

## 📝 Common Operations Quick Reference

| Operation | Method | Endpoint | Auth Required |
|-----------|--------|----------|---|
| Get all teams | GET | `/api/teams` | No |
| Create team | POST | `/api/teams` | Manager/Admin |
| Update team | PUT | `/api/teams/{teamId}` | Manager/Admin |
| Get team players | GET | `/api/teams/{teamId}/players` | No |
| Create player | POST | `/api/players` | Manager/Admin |
| Get standings | GET | `/api/stats/standings` | No |
| Get batting leaderboard | GET | `/api/stats/leaderboard/batting` | No |
| Create tournament | POST | `/api/tournaments` | Manager/Admin |
| Start match | POST | `/api/matches/{matchId}/start` | Manager/Admin |
| Update score | PUT | `/api/matches/{matchId}/score` | Manager/Admin |
| Get AI prediction | GET | `/api/ai/predict/{playerId}` | Any |

---

## 🐛 Debugging Tips

1. **Check Server Logs**: Look for MongoDB connection and API errors
2. **Verify JWT Token**: Decode at jwt.io to check expiration
3. **Test CORS**: Ensure frontend origin is whitelisted
4. **Check Socket.IO Connections**: Browser DevTools Network tab
5. **MongoDB Queries**: Use MongoDB Compass to inspect database
6. **Environment Variables**: Ensure all `.env` variables are set

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Socket.IO Guide](https://socket.io/docs/v4/socket-io-protocol/)
- [JWT Introduction](https://jwt.io/introduction)
- [Google Gemini API](https://ai.google.dev/)

---

**Last Updated**: December 14, 2024
**Version**: 1.0.0
