const mongoose = require('mongoose');
const userSchema = require('../schema/user');

const LoginModel = mongoose.model('Login', userSchema);

module.exports = LoginModel;   