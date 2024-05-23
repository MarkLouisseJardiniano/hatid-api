const express = require('express');
const path = require('path');
const multer = require('multer');
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

// Partially update user profile
router.patch('/profile', auth, upload.single('profilePic'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (req.body.username) {
      user.username = req.body.username;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }
    if (req.body.number) {
      user.number = req.body.number;
    }
    if (req.file) {
      user.profilePic = req.file.filename;
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
