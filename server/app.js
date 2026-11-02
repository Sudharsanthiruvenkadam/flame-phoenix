
require('dotenv').config({
  path: require('path').join(__dirname, '.env'),
});

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const staffRoutes = require('./routes/staffRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Allow both Client and Employee/Admin websites
const allowedOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  'http://localhost:5173,http://localhost:5175'
)
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

// Security middleware
app.use(helmet());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
}));

app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// API health check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Flame Phoenix API is running',
  });
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Project routes
app.use('/api/projects', projectRoutes);

// Employee routes
app.use('/api/staff', staffRoutes);

// Admin routes
app.use('/api/admin', adminRoutes);

// Public company contact route
app.use('/api/contact', contactRoutes);

// Handle unknown API endpoints
app.use('/api', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
  });
});

// Connect to MongoDB and start the server
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is missing from the environment');
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Flame Phoenix API running on port ${PORT}`);
      console.log('Allowed frontend origins:', allowedOrigins);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
