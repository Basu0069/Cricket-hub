# Cricket Hub - Complete API Workflows & Use Cases

## 📖 Real-World Usage Scenarios

This document shows complete workflows for common tasks with actual API calls.

---

## Table of Contents

1. [User Onboarding Workflow](#user-onboarding-workflow)
2. [Manager: Create Team & Add Players](#manager-create-team--add-players)
3. [Manager: Create & Run Tournament](#manager-create--run-tournament)
4. [Live Match Broadcasting](#live-match-broadcasting)
5. [Spectator: Watch & Chat](#spectator-watch--chat)
6. [Data Analysis: Leaderboards](#data-analysis-leaderboards)
7. [Admin Management](#admin-management)

---

## User Onboarding Workflow

### Scenario: New user registers and logs in

### Step 1: User Registers

```bash
# Frontend sends registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "secure_password_123",
    "name": "Sarah Kumar",
    "role": "spectator"
  }'
```

**Backend does**:
1. Check if email already exists
2. Hash password with bcryptjs
3. Create user in MongoDB
4. Generate JWT token
5. Return token & user data

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcl9hYmMxMjM0NSIsImVtYWlsIjoibmV3dXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJzcGVjdGF0b3IiLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MTcwNDE1MzYwMH0.abc123...",
  "token_type": "bearer",
  "user": {
    "user_id": "user_abc12345",
    "email": "newuser@example.com",
    "name": "Sarah Kumar",
    "role": "spectator",
    "picture": null,
    "team_id": null
  }
}
```

### Step 2: Frontend Stores Token

```javascript
// React example
localStorage.setItem('auth_token', response.access_token);
```

### Step 3: User Logs Out (Later)

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcl9hYmMxMjM0NSIsImVtYWlsIjoibmV3dXNlckBleGFtcGxlLmNvbSIsInJvbGUiOiJzcGVjdGF0b3IiLCJpYXQiOjE3MDQwNjcyMDAsImV4cCI6MTcwNDE1MzYwMH0.abc123..."
```

**Backend does**:
1. Invalidate session
2. Clear any cookies
3. Return success message

---

## Manager: Create Team & Add Players

### Scenario: Cricket manager sets up their team

### Prerequisites

Manager account exists with role = "manager"

### Step 1: Create Team

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibWFuYWdlcl8xMjM0NSJ9.abc123..."

curl -X POST http://localhost:5000/api/teams \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mumbai Cricket Club",
    "short_name": "MCC",
    "logo_url": "https://example.com/mcc-logo.png",
    "primary_color": "#004BA0",
    "secondary_color": "#FFFFFF",
    "home_ground": "Wankhede Stadium"
  }'
```

**Backend validates**:
- User has manager/admin role ✓
- Team name is provided ✓
- Creates team with generated ID

**Response**:
```json
{
  "team_id": "team_mcc_12345",
  "name": "Mumbai Cricket Club",
  "short_name": "MCC",
  "logo_url": "https://example.com/mcc-logo.png",
  "primary_color": "#004BA0",
  "secondary_color": "#FFFFFF",
  "home_ground": "Wankhede Stadium",
  "manager_id": "manager_12345",
  "matches_played": 0,
  "matches_won": 0,
  "matches_lost": 0,
  "matches_drawn": 0,
  "points": 0,
  "net_run_rate": 0,
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Step 2: Add Player 1 - Batsman

```bash
curl -X POST http://localhost:5000/api/players \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rohit Sharma",
    "email": "rohit@example.com",
    "team_id": "team_mcc_12345",
    "jersey_number": 45,
    "role": "batsman",
    "batting_style": "right-handed",
    "bowling_style": null,
    "profile_picture": "https://example.com/rohit.jpg"
  }'
```

**Response**:
```json
{
  "player_id": "player_rohit_001",
  "name": "Rohit Sharma",
  "email": "rohit@example.com",
  "team_id": "team_mcc_12345",
  "jersey_number": 45,
  "role": "batsman",
  "batting_style": "right-handed",
  "bowling_style": null,
  "profile_picture": "https://example.com/rohit.jpg",
  "matches": 0,
  "runs": 0,
  "balls_faced": 0,
  "fours": 0,
  "sixes": 0,
  "highest_score": 0,
  "fifties": 0,
  "hundreds": 0,
  "wickets": 0,
  "balls_bowled": 0,
  "runs_conceded": 0,
  "best_bowling": "0/0",
  "catches": 0,
  "stumpings": 0,
  "run_outs": 0,
  "created_at": "2024-01-15T10:32:00Z"
}
```

### Step 3: Add Player 2 - All-rounder

```bash
curl -X POST http://localhost:5000/api/players \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Hardik Pandya",
    "email": "hardik@example.com",
    "team_id": "team_mcc_12345",
    "jersey_number": 31,
    "role": "all-rounder",
    "batting_style": "right-handed",
    "bowling_style": "fast",
    "profile_picture": "https://example.com/hardik.jpg"
  }'
```

### Step 4: Add Player 3 - Bowler

```bash
curl -X POST http://localhost:5000/api/players \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jasprit Bumrah",
    "email": "bumrah@example.com",
    "team_id": "team_mcc_12345",
    "jersey_number": 93,
    "role": "bowler",
    "batting_style": "right-handed",
    "bowling_style": "fast",
    "profile_picture": "https://example.com/bumrah.jpg"
  }'
```

### Step 5: Verify Team Has Players

```bash
curl -X GET http://localhost:5000/api/teams/team_mcc_12345/players
```

**Response**:
```json
[
  {
    "player_id": "player_rohit_001",
    "name": "Rohit Sharma",
    "jersey_number": 45,
    "role": "batsman",
    ...
  },
  {
    "player_id": "player_hardik_001",
    "name": "Hardik Pandya",
    "jersey_number": 31,
    "role": "all-rounder",
    ...
  },
  {
    "player_id": "player_bumrah_001",
    "name": "Jasprit Bumrah",
    "jersey_number": 93,
    "role": "bowler",
    ...
  }
]
```

✅ **Team created with 3 players ready for tournament!**

---

## Manager: Create & Run Tournament

### Scenario: Manager organizes a T20 tournament with 4 teams

### Prerequisites
- 4 teams created (or use existing teams)
- Teams have players
- Manager authenticated

### Step 1: Create Tournament

```bash
TOKEN="manager_token_here"

curl -X POST http://localhost:5000/api/tournaments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mumbai T20 Premier League 2024",
    "sport_type": "cricket",
    "format": "knockout",
    "teams": [
      "team_mcc_12345",
      "team_bcc_12345",
      "team_dcc_12345",
      "team_ccc_12345"
    ],
    "start_date": "2024-02-01",
    "venue": "Wankhede Stadium, Mumbai",
    "overs": 20,
    "match_interval_hours": 24
  }'
```

**Response**:
```json
{
  "tournament_id": "tourn_mtpl_001",
  "name": "Mumbai T20 Premier League 2024",
  "sport_type": "cricket",
  "format": "knockout",
  "status": "draft",
  "teams": ["team_mcc_12345", "team_bcc_12345", "team_dcc_12345", "team_ccc_12345"],
  "created_by": "manager_12345",
  "start_date": "2024-02-01T00:00:00Z",
  "venue": "Wankhede Stadium, Mumbai",
  "overs": 20,
  "match_interval_hours": 24,
  "current_round": 1,
  "winner_id": null,
  "created_at": "2024-01-15T11:00:00Z"
}
```

**Status**: `"draft"` means teams can still be added/removed

### Step 2: Generate Tournament Bracket

```bash
curl -X POST http://localhost:5000/api/tournaments/tourn_mtpl_001/generate-bracket \
  -H "Authorization: Bearer $TOKEN"
```

**Backend does**:
1. Shuffle 4 teams randomly
2. Create 2 matches for round 1:
   - Match 1: Team A vs Team B
   - Match 2: Team C vs Team D
3. Store bracket structure
4. Change status to "upcoming"
5. Broadcast via Socket.IO

**Response**:
```json
{
  "tournament_id": "tourn_mtpl_001",
  "status": "upcoming",
  "matches": [
    {
      "match_id": "match_001",
      "tournament_id": "tourn_mtpl_001",
      "round": 1,
      "match_number": 1,
      "team1_id": "team_mcc_12345",
      "team2_id": "team_bcc_12345",
      "scheduled_time": "2024-02-01T14:00:00Z",
      "status": "scheduled"
    },
    {
      "match_id": "match_002",
      "tournament_id": "tourn_mtpl_001",
      "round": 1,
      "match_number": 2,
      "team1_id": "team_dcc_12345",
      "team2_id": "team_ccc_12345",
      "scheduled_time": "2024-02-01T16:00:00Z",
      "status": "scheduled"
    }
  ]
}
```

### Step 3: Start First Match

```bash
curl -X POST http://localhost:5000/api/matches/match_001/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "toss_winner": "team_mcc_12345",
    "toss_decision": "bat"
  }'
```

**Backend does**:
1. Set match status to "live"
2. Initialize innings 1 with batting team
3. Update tournament status to "live"
4. Broadcast to all Socket.IO clients

**Response**:
```json
{
  "message": "Match started",
  "batting_first": "team_mcc_12345"
}
```

### Step 4: Update Live Scores (Every Over)

```bash
# After 3 overs, Team A has 21 runs, 1 wicket
curl -X PUT http://localhost:5000/api/matches/match_001/score \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "innings": 1,
    "runs": 21,
    "wickets": 1,
    "overs": 3,
    "extras": 2
  }'
```

**Backend does**:
1. Update match in database
2. Broadcast 'score_update' via Socket.IO
3. All connected viewers get real-time update

**Response**:
```json
{
  "match_id": "match_001",
  "status": "live",
  "innings1": {
    "batting_team_id": "team_mcc_12345",
    "runs": 21,
    "wickets": 1,
    "overs": 3,
    "extras": 2,
    "status": "in_progress"
  }
}
```

### Step 5: Complete First Innings After 20 Overs

```bash
# Final score: Team A scored 168 runs, lost 7 wickets
curl -X PUT http://localhost:5000/api/matches/match_001/score \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "innings": 1,
    "runs": 168,
    "wickets": 7,
    "overs": 20,
    "extras": 12
  }'
```

### Step 6: Switch to Second Innings

```bash
curl -X POST http://localhost:5000/api/matches/match_001/switch-innings \
  -H "Authorization: Bearer $TOKEN"
```

**Backend does**:
1. Mark innings1 as "completed"
2. Initialize innings2 with other team
3. Team B now starts batting

### Step 7: Update Second Innings Score

```bash
# After 19 overs, Team B has 170 runs, 5 wickets
curl -X PUT http://localhost:5000/api/matches/match_001/score \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "innings": 2,
    "runs": 170,
    "wickets": 5,
    "overs": 19,
    "extras": 8
  }'
```

### Step 8: Complete Match - Declare Winner

```bash
curl -X POST http://localhost:5000/api/matches/match_001/complete \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "winner_id": "team_bcc_12345",
    "man_of_match": "player_rohit_001"
  }'
```

**Backend does**:
1. Mark match as "completed"
2. Record winner
3. Update team statistics:
   - Winner: +2 points, matches_won +1
   - Loser: matches_lost +1
4. Create next round match (final)
5. Broadcast completion via Socket.IO

**Response**:
```json
{
  "message": "Match completed",
  "winner_id": "team_bcc_12345",
  "tournament_id": "tourn_mtpl_001",
  "next_round": {
    "round": 2,
    "matches": 1
  }
}
```

✅ **Tournament flowing smoothly with real-time updates!**

---

## Live Match Broadcasting

### Scenario: Streaming match to thousands of viewers via Socket.IO

### Frontend Connection Setup

```javascript
// React frontend - setup
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket', 'polling']
});

// When user opens match page
const matchId = 'match_001';
const userId = 'user_viewer_123';

socket.emit('join_match', {
  match_id: matchId,
  user: {
    name: 'John Viewer',
    user_id: userId
  }
});
```

### Receive Recent Messages

```javascript
socket.on('recent_messages', (messages) => {
  console.log('Last 50 messages from match:', messages);
  // Display messages in UI
});
```

**Backend sends** (automatically when user joins):
```json
[
  {
    "match_id": "match_001",
    "user_name": "Earlier Viewer",
    "user_id": "user_xyz",
    "message": "Great start!",
    "created_at": "2024-02-01T14:30:00Z"
  },
  ...
]
```

### Send Live Chat Message

```javascript
socket.emit('send_message', {
  match_id: matchId,
  message: 'Excellent shot! 6 runs!',
  user: {
    name: 'John Viewer',
    user_id: userId
  }
});
```

**Backend does**:
1. Save message to MongoDB
2. Broadcast to all users in `match_001` room
3. Emit 'new_message' event

### Receive Real-time Score Updates

```javascript
socket.on('score_update', (matchData) => {
  console.log('Score updated:', matchData);
  // Update UI with new score:
  // - Current runs
  // - Wickets fallen
  // - Overs completed
  // - Partnership details
});
```

**When manager calls** `PUT /api/matches/match_001/score`:
```json
{
  "match_id": "match_001",
  "status": "live",
  "innings1": {
    "batting_team_id": "team_mcc_12345",
    "runs": 85,
    "wickets": 3,
    "overs": 12.4,
    "extras": 4,
    "status": "in_progress"
  }
}
```

This is sent to ALL connected viewers instantly.

### Viewer Count Updates

```javascript
socket.on('viewer_count', (count) => {
  console.log(`${count} people watching this match`);
});
```

Backend tracks active users and emits updated count to all viewers.

### Tournament-Level Updates

```javascript
// Join tournament room to see all match updates
socket.emit('join_tournament', {
  tournament_id: 'tourn_mtpl_001',
  user: { name: 'John Viewer' }
});

socket.on('tournament_update', (tournamentData) => {
  console.log('Tournament updated:', tournamentData);
  // Updated bracket, standings, etc.
});

socket.on('match_update', (matchData) => {
  console.log('Match in this tournament updated:', matchData);
});
```

---

## Spectator: Watch & Chat

### Scenario: Casual viewer watches match and interacts

### Step 1: Get Live Matches

```bash
# No authentication needed!
curl http://localhost:5000/api/matches/live
```

**Response**:
```json
[
  {
    "match_id": "match_001",
    "tournament_id": "tourn_mtpl_001",
    "team1_id": "team_mcc_12345",
    "team2_id": "team_bcc_12345",
    "status": "live",
    "innings1": {
      "batting_team_id": "team_mcc_12345",
      "runs": 85,
      "wickets": 3,
      "overs": 12.4
    },
    ...
  }
]
```

### Step 2: Get Full Match Details

```bash
curl http://localhost:5000/api/matches/match_001
```

### Step 3: Connect to Live Updates via WebSocket

```javascript
const socket = io('http://localhost:5000');

socket.emit('join_match', {
  match_id: 'match_001',
  user: { name: 'Anonymous Viewer' }
});

// Real-time score updates
socket.on('score_update', (matchData) => {
  updateScoreDisplay(matchData);
});

// Real-time messages
socket.on('new_message', (message) => {
  addMessageToChat(message);
});

// Viewer count
socket.on('viewer_count', (count) => {
  document.getElementById('viewers').textContent = `${count} watching`;
});
```

### Step 4: Send Chat Message

```javascript
socket.emit('send_message', {
  match_id: 'match_001',
  message: 'Amazing performance by Rohit! 🔥',
  user: { name: 'John Viewer' }
});
```

**Backend saves to MongoDB & broadcasts to all viewers**

### Step 5: View Previous Chat

```bash
curl http://localhost:5000/api/chat/match_001
```

**Response** (last 100 messages):
```json
[
  {
    "match_id": "match_001",
    "user_name": "Early Viewer",
    "message": "Great match starting!",
    "created_at": "2024-02-01T14:00:30Z"
  },
  {
    "user_name": "Another Viewer",
    "message": "That was a beautiful shot!",
    "created_at": "2024-02-01T14:15:45Z"
  },
  ...
]
```

---

## Data Analysis: Leaderboards

### Scenario: Viewer checks player statistics and rankings

### Step 1: Get Team Standings

```bash
curl http://localhost:5000/api/stats/standings
```

**Response**:
```json
[
  {
    "position": 1,
    "team_id": "team_bcc_12345",
    "name": "Bangalore Cricket Club",
    "short_name": "BCC",
    "logo_url": "...",
    "matches_played": 5,
    "won": 4,
    "lost": 1,
    "drawn": 0,
    "points": 8,
    "nrr": 1.25
  },
  {
    "position": 2,
    "team_id": "team_mcc_12345",
    "name": "Mumbai Cricket Club",
    "matches_played": 5,
    "won": 3,
    "lost": 2,
    "points": 6,
    "nrr": 0.85
  },
  {
    "position": 3,
    "team_id": "team_ccc_12345",
    "name": "Chennai Cricket Club",
    "matches_played": 4,
    "won": 2,
    "lost": 2,
    "points": 4,
    "nrr": -0.15
  },
  {
    "position": 4,
    "team_id": "team_dcc_12345",
    "name": "Delhi Cricket Club",
    "matches_played": 5,
    "won": 1,
    "lost": 4,
    "points": 2,
    "nrr": -2.10
  }
]
```

### Step 2: Get Top Batsmen

```bash
# Get top 10 batsmen
curl "http://localhost:5000/api/stats/leaderboard/batting?limit=10"
```

**Response**:
```json
[
  {
    "position": 1,
    "player_id": "player_rohit_001",
    "name": "Rohit Sharma",
    "team_id": "team_mcc_12345",
    "matches": 5,
    "runs": 350,
    "average": 70.00,
    "strike_rate": 145.83,
    "highest_score": 95,
    "fours": 28,
    "sixes": 8,
    "fifties": 3,
    "hundreds": 0
  },
  {
    "position": 2,
    "player_id": "player_virat_001",
    "name": "Virat Kohli",
    "team_id": "team_bcc_12345",
    "matches": 5,
    "runs": 320,
    "average": 64.00,
    "strike_rate": 138.46,
    "highest_score": 89,
    "fours": 32,
    "sixes": 4,
    "fifties": 2,
    "hundreds": 0
  },
  ...
]
```

### Step 3: Get Top Bowlers

```bash
curl "http://localhost:5000/api/stats/leaderboard/bowling?limit=10"
```

**Response**:
```json
[
  {
    "position": 1,
    "player_id": "player_bumrah_001",
    "name": "Jasprit Bumrah",
    "team_id": "team_mcc_12345",
    "matches": 5,
    "wickets": 18,
    "runs_conceded": 95,
    "average": 5.28,
    "economy_rate": 3.17,
    "best_bowling": "4/12"
  },
  {
    "position": 2,
    "player_id": "player_sanju_001",
    "name": "Sanjay Singh",
    "team_id": "team_ccc_12345",
    "matches": 4,
    "wickets": 14,
    "runs_conceded": 102,
    "average": 7.29,
    "economy_rate": 4.25,
    "best_bowling": "3/18"
  },
  ...
]
```

### Step 4: Get AI Prediction for Player

```bash
TOKEN="user_token_here"

curl -X GET http://localhost:5000/api/ai/predict/player_rohit_001 \
  -H "Authorization: Bearer $TOKEN"
```

**Backend**:
1. Fetches player data
2. Sends to Google Gemini API
3. Generates prediction based on stats

**Response**:
```json
{
  "prediction_id": "pred_abc123",
  "player_id": "player_rohit_001",
  "player_name": "Rohit Sharma",
  "prediction_text": "Based on Rohit's exceptional T20 record with an average of 70 runs and strike rate of 145.83, he is likely to perform strongly in the upcoming match. Given his consistency in scoring fifties (3 in recent 5 matches) and his ability to hit boundaries (28 fours, 8 sixes), expect him to score between 65-85 runs with approximately 7-9 boundaries. His form is excellent and probability of scoring a half-century is 85%.",
  "created_at": "2024-02-01T16:30:00Z"
}
```

---

## Admin Management

### Scenario: Administrator manages users and system

### Step 1: Login as Admin

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin_password"
  }'
```

### Step 2: Get All Users

```bash
ADMIN_TOKEN="admin_jwt_token_here"

curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response**:
```json
[
  {
    "user_id": "user_1",
    "email": "spectator@example.com",
    "name": "John Spectator",
    "role": "spectator",
    "picture": null,
    "team_id": null
  },
  {
    "user_id": "user_2",
    "email": "manager@example.com",
    "name": "Sarah Manager",
    "role": "manager",
    "picture": "...",
    "team_id": "team_mcc_12345"
  },
  {
    "user_id": "user_3",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "picture": "..."
  }
]
```

### Step 3: Promote User to Manager

```bash
curl -X PUT http://localhost:5000/api/admin/users/user_1/role?role=manager&team_id=team_mcc_12345 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response**:
```json
{
  "message": "User role updated successfully"
}
```

**Now user_1 can manage team_mcc_12345**

### Step 4: Promote Manager to Admin

```bash
curl -X PUT http://localhost:5000/api/admin/users/user_2/role?role=admin \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Step 5: Delete Inactive User

```bash
curl -X DELETE http://localhost:5000/api/admin/users/user_1 \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response**:
```json
{
  "message": "User deleted successfully"
}
```

### Step 6: Seed Sample Data

```bash
curl -X POST http://localhost:5000/api/admin/seed-data \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Response**:
```json
{
  "message": "Seed data created successfully",
  "teams_created": 8
}
```

**Creates 8 IPL teams with sample data**

---

## Complete System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    CRICKET HUB SYSTEM                            │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐
│   USER       │
│ Registers    │
└──────┬───────┘
       │ POST /api/auth/register
       ▼
┌──────────────────────┐
│  Backend Validates   │
│  & Creates User      │
└──────┬───────────────┘
       │ Returns JWT Token
       ▼
┌──────────────────────┐
│  Frontend Stores     │
│  Token in Storage    │
└──────┬───────────────┘
       │
       ├──────────────────────────────────────┐
       │                                      │
       ▼                                      ▼
┌──────────────────┐              ┌─────────────────────┐
│   SPECTATOR      │              │  MANAGER            │
│ (can view all)   │              │ (can create/manage) │
└──────┬───────────┘              └──────┬──────────────┘
       │                                 │
       ├─ GET /api/teams                 ├─ POST /api/teams (create)
       ├─ GET /api/tournaments           ├─ POST /api/players (add)
       ├─ GET /api/stats/standings       ├─ POST /api/tournaments
       ├─ Socket.IO live updates         ├─ POST /api/matches/.../start
       └─ Chat via Socket.IO             └─ PUT /api/matches/.../score
                                             │
                                             ▼
                                    ┌──────────────────────┐
                                    │  TOURNAMENT CREATED  │
                                    │  & RUNNING           │
                                    └──────┬───────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
            ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
            │  Round 1     │      │  Semi-Final  │      │   FINAL      │
            │  Match 1 & 2 │      │  Winners of  │      │   Winner     │
            │              │      │  R1 compete  │      │   Announced  │
            └──────┬───────┘      └──────┬───────┘      └──────────────┘
                   │                     │
                   ├─ Score Updates ──────┼─ Socket.IO Broadcast
                   ├─ Live Chat ──────────┼─ All Viewers Get Update
                   └─ Real-time Stats ────┘

                   ▼ (After Match)
            ┌──────────────────────┐
            │  Match Completed     │
            │  Winner Declared     │
            │  Stats Updated       │
            └──────┬───────────────┘
                   │
                   ├─ Team Points +2
                   ├─ Player Stats Updated
                   ├─ Leaderboards Refreshed
                   └─ Next Round Match Created
```

---

## Performance Metrics to Track

After deployment, monitor these:

```javascript
// API Response Times
- Auth endpoints: < 200ms
- Team/Player endpoints: < 300ms
- Leaderboard queries: < 500ms
- AI predictions: < 3000ms (external API)

// Socket.IO Performance
- Score broadcast latency: < 100ms
- Chat message latency: < 500ms
- Concurrent connections: Handle 10,000+

// Database Performance
- MongoDB indexes on: tournament_id, match_id, user_id
- Query optimization: Aggregate stats queries
- Connection pooling: Maintain 50-100 connections
```

---

## Summary

This document showed real-world workflows:
✅ User registration & authentication
✅ Team creation & player management
✅ Tournament creation & execution
✅ Live match broadcasting
✅ Real-time chat & score updates
✅ Statistics & leaderboards
✅ Admin management

Each workflow includes actual API calls you can copy-paste and test!

---

**Last Updated**: December 14, 2024
**Version**: 1.0.0
