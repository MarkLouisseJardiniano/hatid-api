const express = require('express');
const serverless = require('serverless-http');
const authRouter = require('./routes/auth');
const bookingRouter = require('./routes/booking');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Your MongoDB Cloud URL
const dbCloudUrl = 'mongodb+srv://Mawi:Mawi21@cluster0.twni9tv.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
const dbLocalUrl = 'mongodb://localhost:27017/users';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(dbCloudUrl || dbLocalUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

app.use('/.netlify/functions/api/auth', authRouter);
app.use('/.netlify/functions/api/booking', bookingRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports.handler = serverless(app);
