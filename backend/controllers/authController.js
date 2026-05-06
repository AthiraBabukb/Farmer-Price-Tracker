const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT token
// This token is like a gate pass — proves user is logged in
const generateToken = (id) => {
  return jwt.sign(
    { id },                        // data stored inside token
    process.env.JWT_SECRET,        // secret key from .env
    { expiresIn: '30d' }           // token expires in 30 days
  );
};

// ─────────────────────────────────────
// REGISTER — Create new farmer account
// ─────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    // Get data sent from frontend form
    const { name, email, password, phone, district } = req.body;

    // Check all fields are filled
    if (!name || !email || !password || !phone || !district) {
      return res.status(400).json({
        message: 'Please fill all fields'
      });
    }

    // Check if email already exists in database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    // Create new user — password auto encrypted by User.js
    const user = await User.create({
      name,
      email,
      password,
      phone,
      district
    });

    // Send success response with token
    res.status(201).json({
      message: 'Registration successful',
      _id: user._id,
      name: user.name,
      email: user.email,
      district: user.district,
      token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

// ─────────────────────────────────────
// LOGIN — Login existing farmer
// ─────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    // Get email and password from frontend
    const { email, password } = req.body;

    // Check both fields provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    // Find user by email in database
    const user = await User.findOne({ email });

    // Check if user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        message: 'Login successful',
        _id: user._id,
        name: user.name,
        email: user.email,
        district: user.district,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({
        message: 'Invalid email or password'
      });
    }

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = { registerUser, loginUser };