const mongoose = require('mongoose');
const env = require('./config/env');
const User = require('./models/User');

async function main() {
  try {
    await mongoose.connect(env.mongoUri);

    if (mongoose.connection.name !== 'flame_phoenix') {
      throw new Error('Unexpected database; update cancelled.');
    }

    const email = 'sudharsan0988@gmail.com';
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Account not found; update cancelled.');
    }

    if (user.isActive !== true) {
      throw new Error('Account is inactive; update cancelled.');
    }

    if (user.role === 'ADMIN') {
      console.log('Account is already ADMIN. No change needed.');
      return;
    }

    if (user.role !== 'CLIENT') {
      throw new Error(
        `Unexpected current role (${user.role}); update cancelled.`
      );
    }

    user.role = 'ADMIN';
    await user.save();

    const verified = await User.findOne({ email })
      .select('name email role isActive')
      .lean();

    console.log('Verified account after update:', {
      name: verified.name,
      email: verified.email,
      role: verified.role,
      isActive: verified.isActive
    });
  } finally {
    await mongoose.disconnect();
  }
}

main().catch(error => {
  console.error('Admin promotion failed:', error.message);
  process.exitCode = 1;
});
