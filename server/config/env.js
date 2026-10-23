require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  adminName: process.env.ADMIN_NAME || 'Flame Phoenix Admin',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@flamephoenix.com',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
};

if (!env.mongoUri) {
  throw new Error('MONGO_URI is missing from .env');
}

if (!env.jwtSecret) {
  throw new Error('JWT_SECRET is missing from .env');
}

module.exports = env;
