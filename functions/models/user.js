const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  // Schema definition remains the same
});

// Methods and schema hooks remain the same

const User = mongoose.model('User', userSchema);

module.exports = User;
