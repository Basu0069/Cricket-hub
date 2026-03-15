# Cricket Hub Backend - Quick Start Guide

## ⚡ Get Running in 5 Minutes

This guide gets you from zero to working backend instantly.

---

## 🚀 Quick Setup

### Step 1: Install Node Modules (2 minutes)

```bash
cd backend
npm install
```

**What it does**: Downloads all required packages (Express, MongoDB driver, Socket.IO, etc.)

---

### Step 2: Create Environment File (1 minute)

Create a `.env` file in the `backend` folder:

```bash
cat > .env << 'EOF'
# MongoDB Configuration
MONGO_URL=mongodb://localhost:27017
DB_NAME=cricket_league

# JWT Configuration
JWT_SECRET=your_secret_key_here_make_it_long_and_random
JWT_EXPIRATION=24h

# Server Configuration
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Google Gemini API (optional, for AI predictions)
GEMINI_API_KEY=your_gemini_api_key_here
EOF
```

---

### Step 3: Start MongoDB (1 minute)

**On macOS with Homebrew**:
```bash
brew services start mongodb-community
```

**Check if running**:
```bash
mongosh
# Type: exit (to quit)
```

**Or run locally** (without Homebrew):
```bash
mongod
# Keep this terminal open
```

---

### Step 4: Start Backend Server (1 minute)

In a new terminal:

```bash
cd backend
npm run dev
```

**Expected output**:
```
Connected to MongoDB
Server running on port 5000
```

✅ **You're live! Backend is running at http://localhost:5000**

---

## 🧪 Test Your Backend

### Quick Test 1: Get All Teams

```bash
curl http://localhost:5000/api/teams
```

**Expected response**: Empty array `[]` (or existing teams)

### Quick Test 2: Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "spectator"
  }'
```

**Expected response**: User object with `access_token`

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "user_id": "user_abc123",
    "email": "test@example.com",
    "name": "Test User",
    "role": "spectator"
  }
}
```

---

## 📚 Common Next Steps

### Step 1: Create First Team (As Manager)

1. **Upgrade your user to Manager**:

```bash
# First, save the token from registration response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Login as admin first (assuming admin exists), or use the seed endpoint
```

2. **Seed sample data** (creates 8 teams):

```bash
# You need admin access first
# Skip this for now, go to step 3 for manual creation
```

3. **Create team manually**:

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:5000/api/teams \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mumbai Indians",
    "short_name": "MI",
    "primary_color": "#004BA0",
    "home_ground": "Wankhede Stadium"
  }'
```

### Step 2: Add Players to Team

```bash
curl -X POST http://localhost:5000/api/players \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Virat Kohli",
    "team_id": "team_abc123",
    "jersey_number": 18,
    "role": "batsman",
    "batting_style": "right-handed"
  }'
```

### Step 3: Create Tournament

```bash
curl -X POST http://localhost:5000/api/tournaments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "T20 League 2024",
    "format": "knockout",
    "teams": ["team_abc123", "team_def456"],
    "start_date": "2024-01-15",
    "venue": "Mumbai"
  }'
```

### Step 4: Generate Bracket & Start Matches

```bash
TOURN_ID="tourn_abc123"

curl -X POST http://localhost:5000/api/tournaments/$TOURN_ID/generate-bracket \
  -H "Authorization: Bearer $TOKEN"
```

### Step 5: Start a Match

```bash
MATCH_ID="match_abc123"

curl -X POST http://localhost:5000/api/matches/$MATCH_ID/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "toss_winner": "team_abc123",
    "toss_decision": "bat"
  }'
```

### Step 6: Update Live Score

```bash
curl -X PUT http://localhost:5000/api/matches/$MATCH_ID/score \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "innings": 1,
    "runs": 85,
    "wickets": 3,
    "overs": 12,
    "extras": 4
  }'
```

---

## 📁 File Structure Quick Reference

```
backend/
├── server.js              # Main server (entry point)
├── models.js              # Data schemas (User, Team, Match, etc.)
├── middleware.js          # Authentication logic
├── api/
│   └── routes/
│       ├── auth.js        # Login/Register endpoints
│       ├── teams.js       # Team management
│       ├── players.js     # Player management
│       ├── tournaments.js # Tournament creation
│       ├── matches.js     # Match operations
│       ├── stats.js       # Leaderboards
│       ├── admin.js       # Admin functions
│       ├── chat.js        # Chat messages
│       └── ai.js          # AI predictions
├── .env                   # Environment variables (CREATE THIS)
├── package.json           # Dependencies
└── README.md              # Setup guide
```

---

## 🔐 Authentication: Bearer Token

All protected endpoints need this header:

```
Authorization: Bearer <your_token>
```

Example:
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 📊 API Endpoints Cheat Sheet

| Action | Endpoint | Method | Auth |
|--------|----------|--------|------|
| Get all teams | `/api/teams` | GET | ❌ |
| Create team | `/api/teams` | POST | ✅ Manager |
| Get all players | `/api/players` | GET | ❌ |
| Create player | `/api/players` | POST | ✅ Manager |
| Get tournaments | `/api/tournaments` | GET | ❌ |
| Create tournament | `/api/tournaments` | POST | ✅ Manager |
| Start match | `/api/matches/{id}/start` | POST | ✅ Manager |
| Update score | `/api/matches/{id}/score` | PUT | ✅ Manager |
| Get standings | `/api/stats/standings` | GET | ❌ |
| Get predictions | `/api/ai/predict/{id}` | GET | ✅ Any |

---

## 🐛 Troubleshooting

### "MongoDB connection error"

**Problem**: Can't connect to MongoDB

**Solutions**:
```bash
# Check if MongoDB is running
mongosh

# Start MongoDB if not running
brew services start mongodb-community

# Or start MongoDB manually
mongod
```

### "CORS not allowed"

**Problem**: Frontend can't reach backend

**Solution**: Check `.env` has correct `FRONTEND_URL`:
```
FRONTEND_URL=http://localhost:3000
```

### "Not authenticated" Error

**Problem**: Getting 401 Unauthorized

**Solutions**:
1. Did you include the Authorization header?
2. Is your token expired? (default 24h)
3. Is the token format correct? (`Bearer <token>`, not just `<token>`)

### "Admin access required"

**Problem**: Getting 403 Forbidden on admin routes

**Solution**: You need admin role. Ask another admin to upgrade your account:
```bash
# Only an existing admin can do this
curl -X PUT http://localhost:5000/api/admin/users/{userId}/role?role=admin \
  -H "Authorization: Bearer <admin_token>"
```

### Server crashes with syntax errors

**Problem**: You edited a file incorrectly

**Solution**:
1. Check the error message for file and line number
2. Open that file and fix the syntax
3. Restart server: `npm run dev`

---

## 🎮 Testing with Postman

### Import Collection

1. Open [Postman](https://www.postman.com/downloads/)
2. Click "New" → "Request"
3. Enter:
   - **Method**: GET
   - **URL**: http://localhost:5000/api/teams
4. Click "Send"

### Set Up Authentication Header

1. Go to "Headers" tab
2. Add:
   - **Key**: Authorization
   - **Value**: Bearer <your_token_here>
3. Click "Send"

---

## 🔄 Real-time Chat (Socket.IO)

### Connect to Live Match Chat

```javascript
// Frontend JavaScript example
const socket = io('http://localhost:5000');

// Join a match room
socket.emit('join_match', {
  match_id: 'match_abc123',
  user: { name: 'John', user_id: 'user_xyz' }
});

// Receive recent messages
socket.on('recent_messages', (messages) => {
  console.log('Recent messages:', messages);
});

// Send a message
socket.emit('send_message', {
  match_id: 'match_abc123',
  message: 'Great shot!',
  user: { name: 'John' }
});

// Receive new messages in real-time
socket.on('new_message', (message) => {
  console.log('New message:', message);
});

// Get live score updates
socket.on('score_update', (matchData) => {
  console.log('Updated score:', matchData);
});
```

---

## 📈 Scaling Up

### Add Database Backup

```bash
# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/cricket_league" --out ./backup

# Restore from backup
mongorestore ./backup
```

### Enable Production Mode

```bash
# Stop dev server (Ctrl+C)
NODE_ENV=production npm start
```

### Add More Teams/Players Programmatically

Create `seed-teams.js`:

```javascript
const mongoose = require('mongoose');
const { Team } = require('./models');

mongoose.connect('mongodb://localhost:27017/cricket_league');

const teams = [
  { name: 'Mumbai Indians', short_name: 'MI', primary_color: '#004BA0' },
  { name: 'Chennai Super Kings', short_name: 'CSK', primary_color: '#F9CD05' },
  // Add more...
];

teams.forEach(async (team) => {
  await Team.create({
    team_id: `team_${Math.random().toString(36).slice(2)}`,
    ...team,
    created_at: new Date()
  });
});

console.log('Teams created!');
```

Run with: `node seed-teams.js`

---

## 🌐 Deploy to Production

### Deploy to Render

1. Push code to GitHub
2. Create account on [render.com](https://render.com)
3. Connect GitHub repo
4. Set environment variables
5. Deploy!

See [render.yaml](./render.yaml) in backend folder for config.

---

## 📱 Frontend Connection

### Connect React Frontend

In your React `.env` file:

```
REACT_APP_API_URL=http://localhost:5000
```

In your API service:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

---

## 📞 Need Help?

### Check Logs

```bash
# Look for error messages in terminal
# Most issues show up here!

# If you're using npm dev (with nodemon)
npm run dev
# Watch the console output
```

### Debug MongoDB

```bash
mongosh
> use cricket_league
> db.teams.find()
> db.users.find()
> exit
```

### Enable Debug Mode

```bash
# In server.js, uncomment console logs or add:
if (process.env.DEBUG) {
  console.log('Detailed logs here...');
}

# Then run:
DEBUG=* npm run dev
```

---

## ✅ You're Ready!

- ✅ MongoDB running
- ✅ Backend started on port 5000
- ✅ API endpoints working
- ✅ Ready to connect frontend

**Next**: Open [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint docs!

---

## 🎓 Learning Path

1. **Understanding**: Read [BACKEND_OVERVIEW.md](./BACKEND_OVERVIEW.md)
2. **API Details**: Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
3. **Hands-on**: Test endpoints with cURL/Postman
4. **Integration**: Connect your frontend
5. **Customization**: Modify code for your needs

---

## 📚 Recommended Resources

- [Express.js Beginner Guide](https://expressjs.com/starter/basic-routing.html)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/introduction/)
- [RESTful API Design](https://restfulapi.net/)
- [JWT Explained](https://jwt.io/introduction)
- [Socket.IO Tutorial](https://socket.io/docs/v4/socket-io-client-api/)

---

**Your backend is now ready! 🚀**

**Questions?** Check [BACKEND_OVERVIEW.md](./BACKEND_OVERVIEW.md) and [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

**Last Updated**: December 14, 2024
