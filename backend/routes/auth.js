const express = require('express');
const router = express.Router();

// Import controller functions
const { registerUser, loginUser } = require('../controllers/authController');

// POST /api/auth/register → calls registerUser
router.post('/register', registerUser);

// POST /api/auth/login → calls loginUser
router.post('/login', loginUser);

module.exports = router;