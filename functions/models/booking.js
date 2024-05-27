// models/booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  pickup: { type: String, required: true },
  destination: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
