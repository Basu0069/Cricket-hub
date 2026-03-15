# Cricket Hub API Documentation

## 🎯 Complete API Reference Guide for Beginners

This guide explains every API endpoint in simple terms with examples. No prior backend knowledge required!

---

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Team APIs](#team-apis)
3. [Player APIs](#player-apis)
4. [Tournament APIs](#tournament-apis)
5. [Match APIs](#match-apis)
6. [Statistics APIs](#statistics-apis)
7. [Chat APIs](#chat-apis)
8. [Admin APIs](#admin-apis)
9. [AI APIs](#ai-apis)
10. [Error Codes](#error-codes)

---

## Authentication APIs

### What is Authentication?

Think of it as logging into your account. When you create an account or log in, the server gives you a special token (like a digital ID card). You use this token to prove who you are for every request.

---

### 📝 Register a New User

**Purpose**: Create a new user account

```
POST /api/auth/register
```

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "spectator"          // Optional: "spectator", "manager", or "admin"
}
```

**Success Response (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "user_id": "user_abc12345",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "spectator",
    "picture": null,
    "team_id": null
  }
}
```

**Usage**:
1. Save the `access_token` in your frontend (localStorage)
2. Use it for all future API requests
3. Include it in the Authorization header: `Authorization: Bearer <token>`

---

### 🔓 User Login

**Purpose**: Log in with existing credentials

```
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "user_id": "user_abc12345",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "spectator",
    "picture": "https://example.com/pic.jpg",
    "team_id": "team_xyz123"
  }
}
```

**Error Responses**:
- **401 Unauthorized**: Invalid email or password
- **500 Server Error**: Something went wrong

---

### 🔐 Google OAuth Login

**Purpose**: Log in using Google account

```
POST /api/auth/google/callback
```

**Request Body**:
```json
{
  "id_token": "<google_id_token_from_frontend>"
}
```

**Success Response (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "user_id": "user_abc12345",
    "email": "user@gmail.com",
    "name": "John Doe",
    "role": "spectator",
    "picture": "https://lh3.googleusercontent.com/...",
    "team_id": null
  }
}
```

---

### 👤 Get Current User Info

**Purpose**: Retrieve details of the currently logged-in user

```
GET /api/auth/me
```

**Required Headers**:
```
Authorization: Bearer <your_token>
```

**Success Response (200)**:
```json
{
  "user_id": "user_abc12345",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "spectator",
  "picture": "https://example.com/pic.jpg",
  "team_id": "team_xyz123"
}
```

**Error Response (401)**:
```json
{
  "detail": "Not authenticated"
}
```

---

### 🚪 Logout

**Purpose**: Log out and end session

```
POST /api/auth/logout
```

**Required Headers**:
```
Authorization: Bearer <your_token>
```

**Success Response (200)**:
```json
{
  "message": "Logged out successfully"
}
```

---

## Team APIs

### What is a Team?

A team represents a cricket team with players. Only managers can create/edit teams.

---

### 📋 Get All Teams

**Purpose**: Fetch list of all teams in the system

```
GET /api/teams
```

**Optional Query Parameters**:
- None (gets all teams)

**Success Response (200)**:
```json
[
  {
    "team_id": "team_abc12345",
    "name": "Mumbai Indians",
    "short_name": "MI",
    "logo_url": "https://example.com/mi-logo.png",
    "primary_color": "#004BA0",
    "secondary_color": "#18181b",
    "home_ground": "Wankhede Stadium",
    "manager_id": "user_xyz789",
    "matches_played": 10,
    "matches_won": 7,
    "matches_lost": 2,
    "matches_drawn": 1,
    "points": 15,
    "net_run_rate": 1.35,
    "created_at": "2024-01-10T08:00:00Z"
  },
  {
    "team_id": "team_def45678",
    "name": "Chennai Super Kings",
    "short_name": "CSK",
    ...
  }
]
```

---

### 🔍 Get Single Team

**Purpose**: Get details of a specific team

```
GET /api/teams/{teamId}
```

**Path Parameters**:
- `teamId` (string): Team ID like "team_abc12345"

**Success Response (200)**:
```json
{
  "team_id": "team_abc12345",
  "name": "Mumbai Indians",
  "short_name": "MI",
  "logo_url": "https://example.com/mi-logo.png",
  "primary_color": "#004BA0",
  "secondary_color": "#18181b",
  "home_ground": "Wankhede Stadium",
  "manager_id": "user_xyz789",
  "matches_played": 10,
  "matches_won": 7,
  "matches_lost": 2,
  "matches_drawn": 1,
  "points": 15,
  "net_run_rate": 1.35,
  "created_at": "2024-01-10T08:00:00Z"
}
```

**Error Response (404)**:
```json
{
  "detail": "Team not found"
}
```

---

### ➕ Create Team

**Purpose**: Create a new team (Manager/Admin only)

```
POST /api/teams
```

**Required Headers**:
```
Authorization: Bearer <your_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Mumbai Indians",
  "short_name": "MI",
  "logo_url": "https://example.com/mi-logo.png",
  "primary_color": "#004BA0",
  "secondary_color": "#18181b",
  "home_ground": "Wankhede Stadium"
}
```

**Success Response (200)**:
```json
{
  "team_id": "team_abc12345",
  "name": "Mumbai Indians",
  "short_name": "MI",
  "logo_url": "https://example.com/mi-logo.png",
  "primary_color": "#004BA0",
  "secondary_color": "#18181b",
  "home_ground": "Wankhede Stadium",
  "manager_id": "user_xyz789",
  "matches_played": 0,
  "matches_won": 0,
  "matches_lost": 0,
  "matches_drawn": 0,
  "points": 0,
  "net_run_rate": 0,
  "created_at": "2024-01-10T08:00:00Z"
}
```

**Error Responses**:
- **401 Unauthorized**: Not logged in
- **403 Forbidden**: Not a manager or admin
- **500 Server Error**: Creation failed

---

### ✏️ Update Team

**Purpose**: Edit team information (Manager/Admin only)

```
PUT /api/teams/{teamId}
```

**Required Headers**:
```
Authorization: Bearer <your_token>
Content-Type: application/json
```

**Request Body** (any fields you want to update):
```json
{
  "primary_color": "#FF5733",
  "home_ground": "New Stadium",
  "logo_url": "https://example.com/new-logo.png"
}
```

**Success Response (200)**:
```json
{
  "team_id": "team_abc12345",
  "name": "Mumbai Indians",
  "primary_color": "#FF5733",
  "home_ground": "New Stadium",
  ...
}
```

**Error Responses**:
- **403 Forbidden**: You can only update your own team (if you're a manager)
- **404 Not Found**: Team doesn't exist

---

### 🗑️ Delete Team

**Purpose**: Delete a team (Manager/Admin only)

```
DELETE /api/teams/{teamId}
```

**Required Headers**:
```
Authorization: Bearer <your_token>
```

**Success Response (200)**:
```json
{
  "message": "Team deleted successfully"
}
```

**Note**: This also deletes all players in that team.

---

### 👥 Get Team Players

**Purpose**: Get all players in a team

```
GET /api/teams/{teamId}/players
```

**Success Response (200)**:
```json
[
  {
    "player_id": "player_xyz123",
    "name": "Virat Kohli",
    "email": "virat@example.com",
    "team_id": "team_abc12345",
    "jersey_number": 18,
    "role": "batsman",
    "batting_style": "right-handed",
    "bowling_style": null,
    "profile_picture": "https://example.com/virat.jpg",
    "matches": 50,
    "runs": 2500,
    "balls_faced": 2100,
    ...
  },
  ...
]
```

---

## Player APIs

### What is a Player?

A player belongs to a team and has cricket statistics (runs, wickets, etc.). Managers create players for their team.

---

### 👨‍🏫 Get All Players

**Purpose**: Get all players in the system

```
GET /api/players
```

**Query Parameters** (optional):
- `team_id`: Filter by team (e.g., `?team_id=team_abc12345`)

**Example**:
```
GET /api/players?team_id=team_abc12345
```

**Success Response (200)**:
```json
[
  {
    "player_id": "player_xyz123",
    "name": "Virat Kohli",
    "team_id": "team_abc12345",
    "jersey_number": 18,
    "role": "batsman",
    "batting_style": "right-handed",
    "bowling_style": null,
    "matches": 50,
    "runs": 2500,
    "balls_faced": 2100,
    "highest_score": 120,
    ...
  },
  ...
]
```

---

### 🔍 Get Single Player

**Purpose**: Get details of a specific player

```
GET /api/players/{playerId}
```

**Success Response (200)**:
```json
{
  "player_id": "player_xyz123",
  "name": "Virat Kohli",
  "email": "virat@example.com",
  "team_id": "team_abc12345",
  "jersey_number": 18,
  "role": "batsman",
  "batting_style": "right-handed",
  "bowling_style": null,
  "profile_picture": "https://example.com/virat.jpg",
  "matches": 50,
  "runs": 2500,
  "balls_faced": 2100,
  "fours": 200,
  "sixes": 50,
  "highest_score": 120,
  "fifties": 15,
  "hundreds": 5,
  "wickets": 0,
  "balls_bowled": 0,
  "runs_conceded": 0,
  "best_bowling": "0/0",
  "catches": 35,
  "stumpings": 0,
  "run_outs": 2,
  "created_at": "2024-01-10T08:00:00Z"
}
```

---

### ➕ Create Player

**Purpose**: Add a new player to a team (Manager/Admin only)

```
POST /api/players
```

**Required Headers**:
```
Authorization: Bearer <your_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Virat Kohli",
  "email": "virat@example.com",
  "team_id": "team_abc12345",
  "jersey_number": 18,
  "role": "batsman",
  "batting_style": "right-handed",
  "bowling_style": null,
  "profile_picture": "https://example.com/virat.jpg"
}
```

**Success Response (200)**:
```json
{
  "player_id": "player_xyz123",
  "name": "Virat Kohli",
  "team_id": "team_abc12345",
  "jersey_number": 18,
  "role": "batsman",
  "matches": 0,
  "runs": 0,
  "wickets": 0,
  ...
}
```

**Field Explanations**:
- `role`: "batsman" | "bowler" | "all-rounder" | "wicket-keeper"
- `batting_style`: "right-handed" | "left-handed"
- `bowling_style`: "fast" | "spin" | "medium" | null (if not a bowler)

---

### ✏️ Update Player

**Purpose**: Update player information or statistics

```
PUT /api/players/{playerId}
```

**Request Body**:
```json
{
  "runs": 2500,
  "wickets": 10,
  "highest_score": 130,
  "catches": 40
}
```

**Success Response (200)**:
```json
{
  "player_id": "player_xyz123",
  "name": "Virat Kohli",
  "runs": 2500,
  "wickets": 10,
  ...
}
```

---

### 🗑️ Delete Player

**Purpose**: Remove a player from the team

```
DELETE /api/players/{playerId}
```

**Success Response (200)**:
```json
{
  "message": "Player deleted successfully"
}
```

---

## Tournament APIs

### What is a Tournament?

A tournament is an event where multiple teams compete. It can be knockout, round-robin, or group-knockout format.

---

### 📅 Get All Tournaments

**Purpose**: Get all tournaments

```
GET /api/tournaments
```

**Query Parameters** (optional):
- `status`: Filter by status ("draft", "upcoming", "live", "completed")
- `sport_type`: Filter by sport ("cricket", "football")

**Examples**:
```
GET /api/tournaments
GET /api/tournaments?status=live
GET /api/tournaments?sport_type=cricket&status=upcoming
```

**Success Response (200)**:
```json
[
  {
    "tournament_id": "tourn_abc123",
    "name": "IPL 2024",
    "sport_type": "cricket",
    "format": "knockout",
    "status": "live",
    "teams": ["team_1", "team_2", "team_3", "team_4"],
    "created_by": "user_manager_id",
    "start_date": "2024-01-15T00:00:00Z",
    "end_date": "2024-02-15T00:00:00Z",
    "venue": "Mumbai, India",
    "overs": 20,
    "match_interval_hours": 24,
    "current_round": 2,
    "winner_id": null,
    "created_at": "2024-01-10T08:00:00Z"
  },
  ...
]
```

---

### 🔍 Get Tournament Details

**Purpose**: Get complete tournament info including matches and teams

```
GET /api/tournaments/{tournamentId}
```

**Success Response (200)**:
```json
{
  "tournament_id": "tourn_abc123",
  "name": "IPL 2024",
  "sport_type": "cricket",
  "format": "knockout",
  "status": "upcoming",
  "teams": ["team_1", "team_2", "team_3", "team_4"],
  "created_by": "user_manager_id",
  "start_date": "2024-01-15T00:00:00Z",
  "venue": "Mumbai, India",
  "overs": 20,
  "current_round": 1,
  "matches": [
    {
      "match_id": "match_1",
      "tournament_id": "tourn_abc123",
      "round": 1,
      "match_number": 1,
      "team1_id": "team_1",
      "team2_id": "team_2",
      "venue": "Mumbai",
      "scheduled_time": "2024-01-15T14:00:00Z",
      "status": "scheduled",
      "winner_id": null
    },
    ...
  ],
  "team_details": [
    {
      "team_id": "team_1",
      "name": "Mumbai Indians",
      "short_name": "MI",
      "logo_url": "...",
      ...
    },
    ...
  ]
}
```

---

### ➕ Create Tournament

**Purpose**: Create a new tournament (Manager/Admin only)

```
POST /api/tournaments
```

**Request Body**:
```json
{
  "name": "IPL 2024",
  "sport_type": "cricket",
  "format": "knockout",
  "teams": ["team_1", "team_2", "team_3", "team_4"],
  "start_date": "2024-01-15",
  "venue": "Mumbai, India",
  "overs": 20,
  "match_interval_hours": 24
}
```

**Success Response (200)**:
```json
{
  "tournament_id": "tourn_abc123",
  "name": "IPL 2024",
  "status": "draft",
  "teams": ["team_1", "team_2", "team_3", "team_4"],
  ...
}
```

**Notes**:
- Tournament starts in "draft" status
- Add teams before generating bracket
- Call "generate-bracket" endpoint to create matches

---

### ✏️ Update Tournament

**Purpose**: Modify tournament details (before starting)

```
PUT /api/tournaments/{tournamentId}
```

**Request Body**:
```json
{
  "venue": "Bangalore, India",
  "overs": 20
}
```

---

### ➕ Add Team to Tournament

**Purpose**: Add a team to the tournament

```
POST /api/tournaments/{tournamentId}/teams
```

**Request Body**:
```json
{
  "team_id": "team_5"
}
```

**Note**: Can only add teams to draft tournaments

---

### 🗑️ Remove Team from Tournament

**Purpose**: Remove a team from tournament

```
DELETE /api/tournaments/{tournamentId}/teams/{teamId}
```

---

### 🎲 Generate Tournament Bracket

**Purpose**: Create match fixtures and start the tournament

```
POST /api/tournaments/{tournamentId}/generate-bracket
```

**What happens**:
1. Shuffles teams randomly
2. Creates matches for first round
3. Generates bracket structure
4. Sets tournament status to "upcoming"
5. All matches initially "scheduled"

**Success Response (200)**:
```json
{
  "message": "Bracket generated",
  "tournament_id": "tourn_abc123",
  "matches_created": 4
}
```

**After generating, matches can be started via Match APIs**

---

## Match APIs

### What is a Match?

A match is a game between two teams in a tournament. Each match has two innings, scores, and results.

---

### ⚡ Get Live Matches

**Purpose**: Get all currently live matches

```
GET /api/matches/live
```

**Success Response (200)**:
```json
[
  {
    "match_id": "match_abc123",
    "tournament_id": "tourn_xyz",
    "round": 1,
    "match_number": 1,
    "team1_id": "team_1",
    "team2_id": "team_2",
    "venue": "Mumbai",
    "scheduled_time": "2024-01-15T14:00:00Z",
    "status": "live",
    "toss_winner": "team_1",
    "toss_decision": "bat",
    "innings1": {
      "batting_team_id": "team_1",
      "runs": 85,
      "wickets": 3,
      "overs": 12,
      "extras": 4,
      "status": "in_progress"
    },
    "innings2": null
  },
  ...
]
```

---

### 📅 Get Upcoming Matches

**Purpose**: Get next matches that haven't started yet

```
GET /api/matches/upcoming
```

**Success Response (200)**:
```json
[
  {
    "match_id": "match_abc123",
    "team1_id": "team_1",
    "team2_id": "team_2",
    "scheduled_time": "2024-01-15T14:00:00Z",
    "status": "scheduled",
    ...
  },
  ...
]
```

---

### 📋 Get All Matches

**Purpose**: Get all matches, optionally filtered by tournament

```
GET /api/matches
```

**Query Parameters**:
- `tournamentId` (optional): Filter by tournament

**Example**:
```
GET /api/matches?tournamentId=tourn_abc123
```

---

### 🔍 Get Match Details

**Purpose**: Get complete details of a specific match

```
GET /api/matches/{matchId}
```

**Success Response (200)**:
```json
{
  "match_id": "match_abc123",
  "tournament_id": "tourn_xyz",
  "round": 1,
  "match_number": 1,
  "team1_id": "team_1",
  "team2_id": "team_2",
  "venue": "Mumbai",
  "scheduled_time": "2024-01-15T14:00:00Z",
  "status": "live",
  "toss_winner": "team_1",
  "toss_decision": "bat",
  "innings1": {
    "batting_team_id": "team_1",
    "runs": 150,
    "wickets": 7,
    "overs": 20,
    "extras": 12,
    "status": "completed"
  },
  "innings2": {
    "batting_team_id": "team_2",
    "runs": 145,
    "wickets": 8,
    "overs": 19.2,
    "extras": 8,
    "status": "in_progress"
  },
  "winner_id": null,
  "man_of_match": null
}
```

---

### 🏁 Start a Match

**Purpose**: Begin a match and set up first innings (Manager/Admin)

```
POST /api/matches/{matchId}/start
```

**Request Body**:
```json
{
  "toss_winner": "team_1",      // Which team won the toss
  "toss_decision": "bat"         // "bat" or "bowl"
}
```

**Logic**:
- If toss_decision = "bat": toss_winner bats first
- If toss_decision = "bowl": the other team bats first

**Success Response (200)**:
```json
{
  "message": "Match started",
  "batting_first": "team_1"
}
```

**What happens**:
- Match status changes to "live"
- Innings 1 initialized with batting team
- Socket.IO notifies all viewers
- Match available for score updates

---

### 📊 Update Match Score

**Purpose**: Update live score during a match

```
PUT /api/matches/{matchId}/score
```

**Request Body**:
```json
{
  "innings": 1,           // Which innings (1 or 2)
  "runs": 85,            // Total runs
  "wickets": 3,          // Total wickets lost
  "overs": 12,           // Overs completed (can be decimal: 12.3)
  "extras": 4            // Extra runs (optional)
}
```

**Success Response (200)**:
```json
{
  "match_id": "match_abc123",
  "innings1": {
    "batting_team_id": "team_1",
    "runs": 85,
    "wickets": 3,
    "overs": 12,
    "extras": 4,
    "status": "in_progress"
  }
}
```

**Real-time Update**:
- All connected WebSocket clients receive "score_update" event
- Viewers see score update in real-time
- No page refresh needed

---

### 🔄 Switch Innings

**Purpose**: End first innings and start second innings

```
POST /api/matches/{matchId}/switch-innings
```

**What happens**:
- Innings 1 marked as "completed"
- Innings 2 starts with the other team batting
- Match status remains "live"

---

### ✅ Complete Match

**Purpose**: Mark match as completed and declare winner

```
POST /api/matches/{matchId}/complete
```

**Request Body**:
```json
{
  "winner_id": "team_1",           // Which team won
  "man_of_match": "player_xyz"     // Best player ID
}
```

**What happens**:
- Match status → "completed"
- Winner stats updated
- Team points updated based on result
- Next round match created (if applicable)
- Tournament updated (if all matches in round done)

**Success Response (200)**:
```json
{
  "message": "Match completed",
  "winner_id": "team_1",
  "tournament_id": "tourn_xyz"
}
```

---

## Statistics APIs

### What is a Statistic?

Statistics track individual player performance and team standings.

---

### 🏆 Get Team Standings

**Purpose**: Get ranking table of all teams

```
GET /api/stats/standings
```

**Success Response (200)**:
```json
[
  {
    "position": 1,
    "team_id": "team_1",
    "name": "Mumbai Indians",
    "short_name": "MI",
    "logo_url": "...",
    "matches_played": 10,
    "won": 7,
    "lost": 2,
    "drawn": 1,
    "points": 15,
    "nrr": 1.35
  },
  {
    "position": 2,
    "team_id": "team_2",
    "name": "Chennai Super Kings",
    "points": 14,
    "nrr": 0.85
  },
  ...
]
```

**Ranking Logic**:
1. Higher points first
2. Higher Net Run Rate (NRR) second
3. Head-to-head record as tiebreaker

---

### 🏅 Get Batting Leaderboard

**Purpose**: Top batsmen by runs scored

```
GET /api/stats/leaderboard/batting
```

**Query Parameters**:
- `limit` (optional): Number of players to return (default: 10)

**Example**:
```
GET /api/stats/leaderboard/batting?limit=20
```

**Success Response (200)**:
```json
[
  {
    "position": 1,
    "player_id": "player_1",
    "name": "Virat Kohli",
    "team_id": "team_1",
    "matches": 50,
    "runs": 2500,
    "average": 50.00,
    "strike_rate": 119.05,
    "highest_score": 120,
    "fours": 200,
    "sixes": 50,
    "fifties": 15,
    "hundreds": 5
  },
  {
    "position": 2,
    "player_id": "player_2",
    "name": "Rohit Sharma",
    "runs": 2400,
    ...
  },
  ...
]
```

**Formulas**:
- Average = Total Runs / Matches
- Strike Rate = (Runs / Balls Faced) × 100

---

### 🎳 Get Bowling Leaderboard

**Purpose**: Top bowlers by wickets

```
GET /api/stats/leaderboard/bowling
```

**Query Parameters**:
- `limit` (optional): Number of players (default: 10)

**Success Response (200)**:
```json
[
  {
    "position": 1,
    "player_id": "player_xyz",
    "name": "Jasprit Bumrah",
    "team_id": "team_1",
    "matches": 45,
    "wickets": 65,
    "runs_conceded": 1850,
    "average": 28.46,
    "economy_rate": 6.17,
    "best_bowling": "4/18"
  },
  ...
]
```

**Formulas**:
- Bowling Average = Runs Conceded / Wickets
- Economy Rate = (Runs Conceded / (Balls Bowled / 6))

---

## Chat APIs

### What is Chat?

During live matches, spectators can send messages. This API retrieves those messages.

---

### 💬 Get Match Chat Messages

**Purpose**: Get all chat messages from a match

```
GET /api/chat/{matchId}
```

**Success Response (200)**:
```json
[
  {
    "match_id": "match_abc123",
    "user_name": "John Doe",
    "user_id": "user_xyz",
    "message": "Great shot!",
    "created_at": "2024-01-15T14:30:45Z"
  },
  {
    "user_name": "Jane Smith",
    "message": "Brilliant bowling!",
    "created_at": "2024-01-15T14:31:20Z"
  },
  ...
]
```

**Real-time Chat via WebSocket**:

The backend also supports real-time chat through Socket.IO:

```javascript
// Frontend connects
socket.emit('join_match', {
  match_id: 'match_abc123',
  user: { name: 'John Doe', user_id: 'user_xyz' }
});

// Receive recent messages
socket.on('recent_messages', (messages) => {
  console.log('Last 50 messages:', messages);
});

// Send message
socket.emit('send_message', {
  match_id: 'match_abc123',
  message: 'Great shot!',
  user: { name: 'John Doe' }
});

// Receive new messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
});
```

---

## Admin APIs

### What is Admin Access?

Admins have full control over the system including user management and database seeding.

---

### 👥 Get All Users

**Purpose**: List all users in the system (Admin only)

```
GET /api/admin/users
```

**Required Headers**:
```
Authorization: Bearer <admin_token>
```

**Success Response (200)**:
```json
[
  {
    "user_id": "user_1",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "spectator",
    "picture": "...",
    "team_id": null,
    "created_at": "2024-01-10T08:00:00Z"
  },
  {
    "user_id": "user_2",
    "email": "manager@example.com",
    "name": "Jane Manager",
    "role": "manager",
    "team_id": "team_1",
    "created_at": "2024-01-11T09:00:00Z"
  },
  ...
]
```

---

### 👤 Change User Role

**Purpose**: Update a user's role (Admin only)

```
PUT /api/admin/users/{userId}/role
```

**Query Parameters**:
- `role` (required): "admin", "manager", or "spectator"
- `team_id` (optional): Team ID for manager role

**Example**:
```
PUT /api/admin/users/user_123/role?role=manager&team_id=team_1
```

**Success Response (200)**:
```json
{
  "message": "User role updated successfully"
}
```

---

### 🗑️ Delete User

**Purpose**: Remove a user from the system (Admin only)

```
DELETE /api/admin/users/{userId}
```

**Success Response (200)**:
```json
{
  "message": "User deleted successfully"
}
```

**Note**: Cannot delete your own account

---

### 🌱 Seed Database

**Purpose**: Add sample data (8 teams) to empty database (Admin only)

```
POST /api/admin/seed-data
```

**Success Response (200)**:
```json
{
  "message": "Seed data created successfully",
  "teams_created": 8
}
```

**Teams Created**:
- Mumbai Indians (MI)
- Chennai Super Kings (CSK)
- Royal Challengers (RCB)
- Kolkata Knight Riders (KKR)
- Delhi Capitals (DC)
- Rajasthan Royals (RR)
- Punjab Kings (PBKS)
- Sunrisers Hyderabad (SRH)

---

## AI APIs

### What is AI Prediction?

Google Gemini AI analyzes player statistics and predicts their next match performance.

---

### 🤖 Get AI Player Prediction

**Purpose**: Generate AI prediction for a player's next match

```
GET /api/ai/predict/{playerId}
```

**Required Headers**:
```
Authorization: Bearer <your_token>
```

**Success Response (200)**:
```json
{
  "prediction_id": "pred_abc123",
  "player_id": "player_xyz",
  "player_name": "Virat Kohli",
  "prediction_text": "Based on Virat's excellent track record and current form, he is likely to score between 45-65 runs in T20 format. With a strike rate above 118%, expect aggressive batting especially against pace bowlers. Key focus areas: power plays where he tends to accumulate runs rapidly. Probability of crossing 50-run mark: 75%.",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**How It Works**:
1. System fetches player career statistics
2. Sends data to Google Gemini API
3. AI generates personalized prediction
4. Prediction stored for history
5. Returns result to user

**Prerequisites**:
- `GEMINI_API_KEY` configured in .env
- Player must have at least some statistics
- User must be authenticated

---

## Error Codes

### Common HTTP Status Codes

| Code | Meaning | Common Cause |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

### Error Response Format

All errors follow this format:

```json
{
  "detail": "Error message explaining what went wrong"
}
```

### Common Errors & Solutions

**Error**: `"Not authenticated"`
- **Cause**: Missing or invalid JWT token
- **Solution**: Check if token is included in Authorization header

**Error**: `"Admin access required"`
- **Cause**: User is not an admin
- **Solution**: Login with admin account

**Error**: `"Team not found"`
- **Cause**: Team ID doesn't exist
- **Solution**: Verify team ID is correct

**Error**: `"Not authorized"`
- **Cause**: Manager trying to edit another manager's team
- **Solution**: Only managers/admins can edit their own resources

---

## Quick Reference Table

| Feature | Endpoint | Method | Auth Required |
|---------|----------|--------|---|
| **Auth** |
| Register | `/api/auth/register` | POST | No |
| Login | `/api/auth/login` | POST | No |
| Get me | `/api/auth/me` | GET | Yes |
| Logout | `/api/auth/logout` | POST | Yes |
| **Teams** |
| All teams | `/api/teams` | GET | No |
| One team | `/api/teams/{id}` | GET | No |
| Create | `/api/teams` | POST | Manager/Admin |
| Update | `/api/teams/{id}` | PUT | Manager/Admin |
| Delete | `/api/teams/{id}` | DELETE | Manager/Admin |
| Team players | `/api/teams/{id}/players` | GET | No |
| **Players** |
| All players | `/api/players` | GET | No |
| One player | `/api/players/{id}` | GET | No |
| Create | `/api/players` | POST | Manager/Admin |
| Update | `/api/players/{id}` | PUT | Manager/Admin |
| Delete | `/api/players/{id}` | DELETE | Manager/Admin |
| **Tournaments** |
| All tournaments | `/api/tournaments` | GET | No |
| One tournament | `/api/tournaments/{id}` | GET | No |
| Create | `/api/tournaments` | POST | Manager/Admin |
| Update | `/api/tournaments/{id}` | PUT | Manager/Admin |
| Add team | `/api/tournaments/{id}/teams` | POST | Manager/Admin |
| Generate bracket | `/api/tournaments/{id}/generate-bracket` | POST | Manager/Admin |
| **Matches** |
| Live matches | `/api/matches/live` | GET | No |
| Upcoming | `/api/matches/upcoming` | GET | No |
| All matches | `/api/matches` | GET | No |
| One match | `/api/matches/{id}` | GET | No |
| Start | `/api/matches/{id}/start` | POST | Manager/Admin |
| Update score | `/api/matches/{id}/score` | PUT | Manager/Admin |
| Switch innings | `/api/matches/{id}/switch-innings` | POST | Manager/Admin |
| Complete | `/api/matches/{id}/complete` | POST | Manager/Admin |
| **Stats** |
| Standings | `/api/stats/standings` | GET | No |
| Batting leaderboard | `/api/stats/leaderboard/batting` | GET | No |
| Bowling leaderboard | `/api/stats/leaderboard/bowling` | GET | No |
| **Chat** |
| Get messages | `/api/chat/{matchId}` | GET | No |
| **Admin** |
| All users | `/api/admin/users` | GET | Admin |
| Change role | `/api/admin/users/{id}/role` | PUT | Admin |
| Delete user | `/api/admin/users/{id}` | DELETE | Admin |
| Seed data | `/api/admin/seed-data` | POST | Admin |
| **AI** |
| Predict player | `/api/ai/predict/{playerId}` | GET | Any |

---

## Testing with cURL

### Example 1: Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "spectator"
  }'
```

### Example 2: Login and get token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Example 3: Get all teams with token

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://localhost:5000/api/teams \
  -H "Authorization: Bearer $TOKEN"
```

---

**Last Updated**: December 14, 2024
**Version**: 1.0.0
**Status**: Complete for Beginners ✅
