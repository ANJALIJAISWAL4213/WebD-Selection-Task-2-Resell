const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust the path if necessary

const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from authorization header

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      req.user = user; // Attach user info to request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
};

module.exports = requireAuth;
