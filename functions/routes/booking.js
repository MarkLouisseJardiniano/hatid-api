// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.post('/', async (req, res) => {
  const { pickup, destination } = req.body;

  try {
    const booking = new Booking({ pickup, destination });
    await booking.save();

    // Notify all connected clients about the new booking
    req.io.emit('new booking', booking);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create booking', error });
  }
});

module.exports = router;
