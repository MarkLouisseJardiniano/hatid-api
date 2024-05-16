const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/auth');

const app = express();

const dbCloudUrl =
'mongodb+srv://Mawi:Mawi21@cluster0.twni9tv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // your mongoDB Cloud URL

const dbLocalUrl = 'mongodb://localhost:27017/users';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(dbCloudUrl || dbLocalUrl)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Failed to connect to MongoDB', error));

app.use('/.netlify/functions/api/auth', authRouter);

module.exports.handler = serverless(app);
