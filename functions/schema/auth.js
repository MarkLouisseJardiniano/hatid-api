const mongoose = require('mongoose');

// Define the address schema first
const addressSchema = new mongoose.Schema({
    municipality: {
      type: String,
      required: true
    },
    barangay: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    }
});

// Define the user schema with reference to the address schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
    required: true
  },
  address: {
    type: addressSchema, // Reference to the address schema
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  birthday: {
    type: String,
    required: true
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
