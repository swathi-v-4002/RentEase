// 

// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// 1. Import your Category model
const Category = require('./models/category.model'); 

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

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
  // 2. Call the seeding function right after connection
  seedCategories(); 
});

// --- 3. Define the Seeding Function ---
const seedCategories = async () => {
  try {
    // Define the list of categories you want to ensure exist
    const defaultCategories = [
      'Electronics',
      'Furniture',
      'Apparel',
      'Books',
      'Sports & Outdoors',
      'Home & Kitchen',
      'Toys & Games',
      'Others',
    ];

    console.log('Checking for default categories...');

    for (const categoryName of defaultCategories) {
      // Find a category by name, or create it if it doesn't exist
      await Category.findOneAndUpdate(
        { name: categoryName }, // Find document by this query
        { name: categoryName }, // The data to insert if not found
        {
          upsert: true, // Create a new doc if no match is found
          new: true,
          setDefaultsOnInsert: true
        }
      );
    }
    
    console.log('Default categories are present.');

  } catch (error) {
    console.error('Error seeding default categories:', error.message);
  }
};

// A simple test route
app.get('/', (req, res) => {
  res.send('Hello from RentEase API!');
});

// Define Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/items', require('./routes/items')); 
app.use('/api/rentals', require('./routes/rentals')); 
app.use('/api/reviews', require('./routes/reviews'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});