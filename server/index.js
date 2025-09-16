// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON bodies

// Connect to MongoDB Atlas
const uri = process.env.MONGO_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

// A simple test route
app.get('/', (req, res) => {
  res.send('Hello from RentEase API!');
});

// Define Routes
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);
app.use('/api/categories', require('./routes/categories'));
app.use('/api/items', require('./routes/items')); 
app.use('/api/rentals', require('./routes/rentals')); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});