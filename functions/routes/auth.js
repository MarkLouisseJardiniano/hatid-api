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
      address,
      number,
      birthday,
    });

    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
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

router.put('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { username, email, fullname, address, number, birthday } = req.body;

      // Find user by ID
      let user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update user details
      user.username = username;
      user.email = email;
      user.fullname = fullname;
      user.address = address;
      user.number = number;
      user.birthday = birthday;

      await user.save();
      res.json({ message: 'User updated successfully' });
  } catch (error) {
      console.error('Error during user update:', error);
      res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
