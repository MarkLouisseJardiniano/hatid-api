const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const auth = require('../middleware/auth');

const router = express.Router();

// Sign-up Route
router.post('/signup', [
  body('email').isEmail(),
  body('name').isLength({ min: 5 }),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, name, password } = req.body;

    // Check if the user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({ email, name, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token for the user
    const token = newUser.generateAuthToken();

    // Respond with the token
    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Protected Route Example
router.get('/protected', auth, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;
