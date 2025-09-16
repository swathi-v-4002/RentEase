const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true // Removes whitespace from both ends
  },
  email: {
    type: String,
    required: true,
    unique: true, // No two users can have the same email
    trim: true,
    lowercase: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

module.exports = User;