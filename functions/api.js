const express = require('express');
const serverless = require('serverless-http');
const authRouter = require('./routes/auth');
const bookingRouter = require('./routes/booking');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);


// Middleware to inject io into requests
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Your MongoDB Cloud URL
const dbCloudUrl = 'mongodb+srv://Mawi:Mawi21@cluster0.twni9tv.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0';
const dbLocalUrl = 'mongodb://localhost:27017/users';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(dbCloudUrl || dbLocalUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

app.use('/.netlify/functions/api/auth', authRouter);
app.use('/.netlify/functions/api/booking', bookingRouter);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

module.exports.handler = serverless(app);
