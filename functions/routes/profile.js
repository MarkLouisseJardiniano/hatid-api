const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const User = require('../schema/auth'); 
const auth = require('../middleware/auth');

const router = express.Router();

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Middleware to authenticate user and attach user document to req.user
async function authenticateUser(req, res, next) {
  try {
    // Assuming the user's ID is available in the token or session
    const userId = req.user.id; // Adjust this line based on your authentication method
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Authentication failed' });
  }
}

// Partially update user profile
router.patch('/profile', auth, upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (req.body.username !== undefined) user.username = req.body.username;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.number !== undefined) user.number = req.body.number;
    if (req.file) user.profilePic = req.file.filename;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
