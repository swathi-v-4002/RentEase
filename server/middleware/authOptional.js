// In middleware/authOptional.js

const jwt = require('jsonwebtoken');
require('dotenv').config(); // Make sure JWT_SECRET is available

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // If no token, just continue without a user
  if (!token) {
    return next();
  }

  // If there is a token, try to verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // If valid, add user to req
    req.user = decoded.user;
    next();
  } catch (err) {
    // If token is invalid (expired, etc.),
    // just continue. req.user will remain undefined.
    next();
  }
};