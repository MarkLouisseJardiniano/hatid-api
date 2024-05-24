const mongoose = require('mongoose');
const profileSchema = require('./profileSchema');

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
