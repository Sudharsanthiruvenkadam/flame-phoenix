const mongoose = require('mongoose');
const env = require('./config/env');
const User = require('./models/User');

async function main() {
  try {
    await mongoose.connect(env.mongoUri);

    // Confirm the expected database before reading any account.
    if (mongoose.connection.name !== 'flame_phoenix') {
      throw new Error('Unexpected database name; no account was changed.');
    }

    const user = await User.findOne({
      email: 'sudharsan0988@gmail.com'
    }).select('name email role isActive').lean();

    if (!user) {
      console.log('RESULT: Account not found.');
      return;
    }

    console.log('Account check:', {
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(error => {
  console.error('Check failed:', error.message);
  process.exitCode = 1;
});
