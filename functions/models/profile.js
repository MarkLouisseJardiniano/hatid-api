const mongoose = require('mongoose');
const profileSchema = require('../schema/profile');

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
