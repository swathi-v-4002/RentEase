const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Token format: "Bearer <token>"
  const token = authHeader.split(' ')[1] || authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('🔒 Token expired for user request');
      return res.status(401).json({ msg: 'Token expired, please log in again' });
    }

    console.error('JWT verification error:', err.message);
    return res.status(401).json({ msg: 'Token is invalid' });
  }
};
