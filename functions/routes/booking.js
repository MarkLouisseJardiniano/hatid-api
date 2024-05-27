const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

router.post('/', async (req, res) => {
  try {
    const { pickup, destination } = req.body;

    // Check if pickup and destination are provided
    if (!pickup || !destination) {
      return res.status(400).json({ message: 'Both pickup and destination are required' });
    }

    // Create a new booking
    const booking = new Booking({ pickup, destination });
    await booking.save();

    // Send success response
    res.status(201).json(booking);
  } catch (error) {
    console.error('Failed to create booking:', error);

    // Check if the error is due to validation or database issue
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Invalid data for booking', error: error.message });
    } else {
      res.status(500).json({ message: 'Failed to create booking', error: error.message });
    }
  }
});

module.exports = router;
