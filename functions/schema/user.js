const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024,
  }
});

// Generate Auth Token Method
userSchema.methods.generateAuthToken = function () {
  const user = {
    _id: this._id,
    name: this.name,
    email: this.email,
  };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Pre-save Middleware for Hashing Password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to Compare Passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
