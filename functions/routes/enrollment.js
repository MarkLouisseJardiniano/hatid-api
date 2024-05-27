const express = require('express');
const bcrypt = require('bcryptjs');
const Driver = require('../schema/enrollment');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.json(drivers);
    } catch (err) {
        console.error('Error fetching drivers:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, fullname, municipality, barangay, street, number, birthday } = req.body;

        // Check if the user already exists
        let user = await Driver.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new Driver({
            username,
            email,
            password: hashedPassword,
            fullname,
            address: { municipality, barangay, street },
            number,
            birthday,
        });

        await user.save();
        res.status(201).json({ message: 'User created successfully', username: user.username });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const driver = await Driver.findOne({ email });
        if (!driver) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, driver.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Vehicle enrollment route
router.post('/enroll-vehicle', async (req, res) => {
    try {
        const { userId, type, model, year, plateNumber } = req.body;

        // Find user by ID
        const user = await Driver.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the plate number is already associated with another user
        const existingVehicle = user.vehicles.find(vehicle => vehicle.plateNumber === plateNumber);
        if (existingVehicle) {
            return res.status(400).json({ message: 'Plate number already registered' });
        }

        // Add the vehicle to the user's vehicles array
        user.vehicles.push({ type, model, year, plateNumber });
        await user.save();

        res.status(201).json({ message: 'Vehicle enrolled successfully', vehicle: { type, model, year, plateNumber } });
    } catch (error) {
        console.error('Error enrolling vehicle:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
