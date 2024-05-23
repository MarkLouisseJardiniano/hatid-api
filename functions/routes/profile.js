const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.put('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, email, number } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(userId, { username, email, number }, { new: true });

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
