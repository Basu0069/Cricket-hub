require('dotenv').config();
const mongoose = require('mongoose');
const { TournamentMatch, ChatMessage } = require('../models.js');

async function checkChat() {
  try {
    await mongoose.connect(process.env.MONGO_URL + '/' + (process.env.DB_NAME || 'cricket_league'));
    console.log('Connected to MongoDB\n');

    // Check specific match
    const matchId = 'match_7038a23e';
    const match = await TournamentMatch.findOne({ match_id: matchId });
    console.log(`Match ${matchId} exists:`, !!match);

    if (match) {
      console.log(`Match: ${match.team1_id} vs ${match.team2_id}`);
    }

    // Check messages for this match
    const messagesForMatch = await ChatMessage.find({ match_id: matchId });
    console.log(`\nMessages for ${matchId}:`, messagesForMatch.length);

    // Check all messages
    const allMessages = await ChatMessage.find({}).sort({ created_at: -1 });
    console.log(`Total messages in DB:`, allMessages.length);

    if (allMessages.length > 0) {
      console.log('\nRecent messages:');
      allMessages.slice(0, 5).forEach((msg, i) => {
        console.log(`${i + 1}. Match: ${msg.match_id}`);
        console.log(`   User: ${msg.user_name}`);
        console.log(`   Message: ${msg.message}`);
        console.log(`   Time: ${msg.created_at}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkChat();
