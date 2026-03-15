# Live Chat Debugging Guide

## Console Logs - What to Expect

### Backend Console (Terminal)
When a user connects and uses chat, you should see:

```
========================================
✅ User connected: socket-id-here
Total connected sockets: 1
========================================

📍 join_match event received
  Match ID: match-123
  User: John Doe
  Fetched 0 recent messages
  Active viewers in match: 1

💬 send_message event received
  Match ID: match-123
  User: John Doe
  Message: Hello everyone watching this ma...
  ✓ Message saved to DB with ID: uuid-here
  ✓ Message broadcasted to match room

👥 Viewer count after join: 1
```

### Frontend Console (Browser DevTools)
When using the app, you should see colored logs:

```
✅ Socket connected: socket-id
📍 Emitting join_match: {match_id: "match-123", user: "John Doe"}
📨 Received recent messages: 5 messages
📤 Sending message: {matchId: "match-123", message: "Hello", user: "John Doe"}
💬 New message received: John Doe - Hello everyone watching this ma...
👥 Viewer count: 1
```

## How to Check Logs

### Backend Logs
1. Open terminal running `npm start` in `/backend` folder
2. Watch for the formatted console output with emojis and separators

### Frontend Logs
1. Open your browser
2. Press `F12` (or `Cmd+Option+I` on Mac) to open DevTools
3. Go to "Console" tab
4. Look for colored logs with emojis

## Troubleshooting

### If you don't see any logs:
1. Check that the server is running: `Server running on port 8001`
2. Check that MongoDB is connected: `Connected to MongoDB`
3. Check that frontend compiled successfully: `Compiled successfully!`
4. Refresh the browser page
5. Open DevTools console before navigating to a tournament

### If you see socket connection error:
1. Check that REACT_APP_BACKEND_URL is set correctly in frontend `.env`
2. Verify backend is running on the correct port (8001)
3. Check CORS settings in backend are correct

### If messages aren't being saved:
1. Check MongoDB is connected
2. Check ChatMessage schema has `message_id` field
3. Look for "Chat error:" message in backend logs

## Testing Steps

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm start`
3. **Login**: Go to http://localhost:3000 and login
4. **Navigate to Tournament**: Click on a tournament
5. **Open Match**: Click on a live match
6. **Open DevTools**: Press F12
7. **Send Message**: Type and send a message
8. **Check Logs**:
   - Backend should show `💬 send_message event received`
   - Frontend should show `💬 New message received`

## Files Modified

- `/backend/server.js` - Added detailed console logging for socket events
- `/backend/models.js` - Made user_id optional in ChatMessage schema
- `/frontend/src/pages/TournamentMatchPage.js` - Added console logs and improved socket handling
- `/frontend/src/pages/TournamentDetailPage.js` - Added console logs and improved socket handling
