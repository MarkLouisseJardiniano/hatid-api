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

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, fullname, address, number, birthday, role, licenseNumber, vehicleDetails } = req.body;

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
      role,
      licenseNumber: role === 'driver' ? licenseNumber : undefined,
      vehicleDetails: role === 'driver' ? vehicleDetails : undefined,
    });

    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
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
      // Optionally, you can implement session-based authentication, OAuth, or another authentication mechanism here
      res.json({ message: 'Login successful' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  

module.exports = router;
