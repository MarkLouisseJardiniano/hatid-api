const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
});

module.exports = profileSchema;
