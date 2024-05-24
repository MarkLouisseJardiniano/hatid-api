const express = require('express');
const router = express.Router();
const Profile = require('../models/profileModel');

router.put('/profile', async (req, res) => {
    try {
        const { username, newUsername } = req.body;

        // Find the profile by username and update the username
        const updatedProfile = await Profile.findOneAndUpdate({ username }, { username: newUsername }, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(updatedProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
