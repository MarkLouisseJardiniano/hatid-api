const express = require('express');
const router = express.Router();
const Profile = require('../models/profile'); // Import your Profile model

router.put('/profile', async (req, res) => {
    try {
        const { username } = req.body;

        // Update the profile in the database
        const updatedProfile = await Profile.findOneAndUpdate({ username }, { username }, { new: true });

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
