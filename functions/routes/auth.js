const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../schema/auth');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../schema/auth');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, fullname, address, number, birthday } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
      fullname,
      address, // Assuming address is an object containing municipality, barangay, and street
      number,
      birthday,
    });

    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error); // Enhanced error logging
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during login:', error); // Enhanced error logging
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

module.exports = router;
