<div align="center">

# 🏏 Cricket Hub – Cricket League Management System

End-to-end web app to manage cricket leagues: tournaments, teams, players, live scoring, real‑time chat, and AI‑powered insights.

</div>

---

## 1. What This Project Is

Cricket Hub is a full‑stack web application that helps you **run and experience a complete cricket league online**.

It covers everything from:

- Creating tournaments and teams
- Managing players and detailed statistics
- Scheduling and running matches
- Showing **live scores** to spectators
- Enabling **YouTube‑style live chat** on match pages
- Generating **AI‑based performance predictions** for players and matches

This README is written to help you **present the project clearly** in a video (YouTube/LinkedIn) or in an interview, focusing on **what** it does and **how** it works, without going deep into code.

---

## 2. Who Uses It & Main Roles

The app is built around three main roles:

- **Spectator**
  - Create an account and log in
  - Browse teams, players, tournaments, and upcoming fixtures
  - Open a live match and see **ball‑by‑ball score updates**
  - Participate in a **live chat** alongside the match
  - View **leaderboards** and detailed statistics

- **Team Manager**
  - Everything a Spectator can do, plus:
  - Create and manage **teams** (name, colors, home ground, logo)
  - Add and edit **players** with full batting/bowling stats
  - Create **tournaments** and generate schedules (e.g. round‑robin)
  - Start matches, update scores, switch innings, and end matches

- **Admin**
  - Full system control
  - Manage all **users** and assign roles
  - Create or delete any **team / player / tournament / match**
  - Seed the system with sample data for demos

When you present the project, you can walk through the app from each role’s perspective.

---

## 3. High‑Level Features

### 3.1 Authentication & Security

- Email/password login and registration using **JWT‑based auth**
- Optional **Google OAuth** login (via Emergent Auth)
- **Role‑based access control** so different users see different options

### 3.2 Team & Player Management

- Create, edit, and delete **teams** with branding (colors, logo, home ground)
- Assign managers to teams
- Create **player profiles** with:
  - Batting stats: matches, runs, balls, fours, sixes, 50s, 100s, highest score
  - Bowling stats: wickets, overs, runs conceded, best figures
  - Fielding stats: catches, stumpings, run outs
- Use these stats later for **leaderboards and predictions**

### 3.3 Tournament & Match Management

- Create tournaments with settings like:
  - Format (knockout / round‑robin / group + knockout)
  - Overs per innings
  - Start/end dates and venues
- Add teams to a tournament and **auto‑generate a match schedule** (round‑robin)
- Manage the full **match lifecycle**:
  - Schedule matches
  - Start a match and record the toss (who bats/bowls first)
  - Update scores and switch innings
  - End the match and store final result

### 3.4 Live Match Centre

- Dedicated match detail page showing:
  - Current score, wickets, overs
  - Both innings summaries
  - Match status (upcoming, live, completed)
- **Live score updates** are pushed to all connected viewers in real time using **Socket.IO**.

### 3.5 Live Chat (YouTube‑Style)

- Each match has its own **chat room**
- Users join automatically when they open a match
- Messages appear instantly for everyone watching that match
- Viewer count shows how many people are currently watching
- Recent messages are loaded when someone joins

This makes the experience feel like a real live stream with chat, but for a custom cricket league.

### 3.6 AI‑Powered Predictions (Gemini)

- Integrates **Google Gemini** (Generative AI) to provide:
  - **Player performance predictions** (e.g., expected runs, wickets)
  - **Match outcome insights** based on teams and previous stats
- Uses stored historical statistics as context to generate predictions
- Requires a `GEMINI_API_KEY` to be set in the backend environment

### 3.7 Stats & Leaderboards

- **League standings** built from match results
- **Top batters** leaderboard (based on runs, strike rate, etc.)
- **Top bowlers** leaderboard (based on wickets, economy rate, etc.)
- All driven by the same structured data model used across the app

---

## 4. How It Works – End‑to‑End Flow

This section is ideal to **explain in your video**. You can turn it into a story:

1. **User Onboarding**
	- A user visits the site and **creates an account** or logs in.
	- The backend validates credentials and issues a **JWT token**, which the frontend stores and sends with each request.

2. **Admin Sets Up the League**
	- The Admin logs in and can **seed initial data**: teams, players, and example tournaments.
	- They can also manage users (promote to manager, etc.).

3. **Manager Creates a Team & Tournament**
	- A Manager logs in and creates a **team** with custom colors, logo, and home ground.
	- They add **players** to the team and fill in base stats.
	- The Manager creates a **tournament**, selects teams, and lets the system **generate the schedule** (e.g., round‑robin fixtures).

4. **Running a Match**
	- On the tournament dashboard, the Manager picks a **scheduled match** and starts it.
	- They record the **toss winner** and who bats first.
	- As the match progresses, the Manager updates scores (runs, wickets, overs, etc.).
	- Every update is saved to MongoDB and **broadcast** via Socket.IO so all connected clients see the score change instantly.

5. **Spectator Experience**
	- A Spectator logs in, goes to the **Matches** or **Live** page, and opens a match.
	- The match page shows live score, basic match info, and a **chat panel**.
	- When they open the page, the frontend connects to Socket.IO, joins the match room, and starts receiving **live `score_update` events**.
	- They can send chat messages, which are instantly broadcast to everyone watching that match.

6. **AI Predictions**
	- On certain player or match views, the frontend calls the AI endpoint.
	- The backend fetches the player’s or teams’ stats from MongoDB, builds a prompt, and calls **Gemini**.
	- The AI returns a human‑readable prediction (e.g., “Expected to score 40–60 runs”), which is displayed in the UI.

7. **After the Match**
	- Once a match is ended, standings and leaderboards are updated.
	- Tournament status and winner information are stored.
	- Historical data can then be used for future AI predictions and statistics views.

---

## 5. High‑Level Architecture

- **Frontend** (React + Tailwind + shadcn/ui)
  - SPA with pages for landing, login/register, dashboard, live scoring, leaderboards, admin, etc.
  - Communicates with the backend via **REST APIs** using Axios.
  - Maintains auth state in an **AuthContext**.
  - Uses a **SocketContext** to manage the WebSocket (Socket.IO) connection.

- **Backend** (Node.js + Express + MongoDB + Socket.IO)
  - Exposes REST endpoints under `/api` for auth, teams, players, tournaments, matches, stats, chat, admin, and AI.
  - Stores data in **MongoDB** using Mongoose models.
  - Handles authentication and **role‑based authorization** via middleware.
  - Integrates **Socket.IO** for real‑time features like live scores and chat.
  - Optionally calls **Google Gemini** for AI features.

- **Database** (MongoDB)
  - Stores all entities: `users`, `teams`, `players`, `tournaments`, `tournamentmatches`, `chatmessages`, `predictions`, etc.
  - Designed so stats can be easily aggregated for leaderboards and AI prompts.

When presenting, you can summarize this as:

> “React frontend talks to an Express + MongoDB backend over REST, and Socket.IO handles all the real‑time updates for scores and chat. AI is plugged in via Google Gemini for predictions.”

---

## 6. Tech Stack (Short Version)

- **Frontend:** React, React Router, Tailwind CSS, shadcn/ui, Axios, Socket.IO client
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), Socket.IO, JWT, bcrypt, Google Gemini API
- **Infrastructure:** Can run locally (Node + MongoDB) or be deployed to services like Render (backend) and Vercel/Netlify (frontend)

---

## 7. Running the Project Locally (High‑Level)

This section is **optional to show in your video**, but useful if someone wants to try the app.

1. **Clone the repo**
	```bash
	git clone <your‑repo‑url>
	cd cricket-hub
	```

2. **Start the backend**
	```bash
	cd backend
	npm install
	# create a .env file based on the examples in the docs
	npm run dev
	```

3. **Start the frontend**
	```bash
	cd ../frontend
	npm install
	npm start
	```

4. Open the app at `http://localhost:3000` and log in using the seeded admin/manager accounts (see backend docs for default credentials).

For more detailed setup, see the backend documentation inside the `backend/DOC` folder.

---

## 8. How to Present This Project in a Video

You can structure your video like this:

1. **Intro (30–60 seconds)**
	- Who you are and what Cricket Hub is.
	- One‑line problem statement: “Managing local cricket leagues is usually done in spreadsheets and WhatsApp. I built a full web app to manage everything in one place.”

2. **High‑Level Features (1–2 minutes)**
	- Briefly show: dashboard → tournaments → teams → players → live match → chat → leaderboards → AI prediction.

3. **Walkthrough by Role (2–4 minutes)**
	- Show how a **Manager** sets up a tournament and starts a match.
	- Switch to a **Spectator** view: open live match, watch score updates, send chat messages.
	- Mention that **Admin** can manage users and data.

4. **How It Works (1–2 minutes)**
	- Very briefly talk through the architecture:
	  - React frontend
	  - Node/Express backend
	  - MongoDB
	  - Socket.IO for real time
	  - Gemini for AI predictions

5. **Wrap‑Up (30–60 seconds)**
	- Summarize what you learned: real‑time systems, auth, role‑based access, integrating AI.
	- Invite viewers to connect on LinkedIn or check the repo.

---

## 9. Possible Future Improvements

- Link player profiles with actual user accounts
- Add ball‑by‑ball commentary and richer scorecards
- Add push notifications (e.g., “match starting”, “wicket!”)
- Support player transfers between teams
- Export statistics to CSV/PDF for league organizers

---

By using this README as your script, you can confidently explain **what** the project does, **who** it is for, and **how** it works at a high level—without needing to go deep into implementation details.

