// Simple Socket.IO client to trigger server logs
const { io } = require('socket.io-client');

const API_URL = process.env.TEST_BACKEND_URL || 'http://localhost:8001';

console.log('Connecting to', API_URL);

const socket = io(API_URL, {
  transports: ['polling', 'websocket'],  // Try polling first, then upgrade
  withCredentials: false,  // Not needed for localhost
  reconnection: false,
  timeout: 5000,
});

socket.on('connect', () => {
  console.log('Client connected:', socket.id);

  const user = { name: 'SocketTest', user_id: 'socket-test', picture: null };
  const tournament_id = 'TEST_TOURNAMENT_001';
  const match_id = 'TEST_MATCH_001';

  console.log('Joining tournament room:', tournament_id);
  socket.emit('join_tournament', { tournament_id, user });

  console.log('Joining match room:', match_id);
  socket.emit('join_match', { match_id, user });

  setTimeout(() => {
    console.log('Sending test message...');
    socket.emit('send_message', { match_id, message: 'Hello from test client!', user });
  }, 500);

  setTimeout(() => {
    console.log('Leaving rooms and disconnecting...');
    socket.emit('leave_match', { match_id });
    socket.emit('leave_tournament', { tournament_id });
    socket.disconnect();
    setTimeout(() => process.exit(0), 200);
  }, 2000);
});

socket.on('connect_error', (err) => {
  console.error('Client connect_error:', err.message);
});

socket.on('new_message', (msg) => {
  console.log('Client received new_message:', msg);
});

socket.on('recent_messages', (msgs) => {
  console.log('Client received recent_messages:', msgs.length);
});

socket.on('tournament_viewer_count', (count) => {
  console.log('Client tournament_viewer_count:', count);
});
