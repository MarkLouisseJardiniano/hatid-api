const express = require('express');
const router = express.Router();
const Profile = require('../models/profile'); // Import your Profile model

router.put('/:_id', async (req, res) => {
    try {
        const { username } = req.body;

        // Update the username in the database
        const updatedProfile = await Profile.findOneAndUpdate({ _id: req.user._id }, { username }, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        res.json(updatedProfile);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
