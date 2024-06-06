const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');

router.post('/', async (req, res) => {
  try {
    const { pickup, destination } = req.body;
    console.log('Request Body:', req.body);

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


router.get('/booking', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

// GET: Retrieve a booking by ID
router.get('/booking/:id', async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    res.status(500).json({ message: 'Failed to fetch booking', error: error.message });
  }
});

module.exports = router;
