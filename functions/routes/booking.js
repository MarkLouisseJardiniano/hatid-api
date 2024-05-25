// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

router.post('/', async (req, res) => {
  const { pickup, destination } = req.body;

  // Validation: Check if pickup and destination are provided
  if (!pickup || !destination) {
    return res.status(400).json({ message: 'Both pickup and destination are required' });
  }

  try {
    const booking = new Booking({ pickup, destination });
    await booking.save();

    // Notify all connected clients about the new booking
    req.io.emit('new booking', booking);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Failed to create booking:', error);
    res.status(500).json({ message: 'Failed to create booking' });
  }
});

module.exports = router;
