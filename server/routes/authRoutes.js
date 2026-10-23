
const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Client registration
router.post('/register', register);

// Login for Client, Staff, and Admin
router.post('/login', login);

module.exports = router;
