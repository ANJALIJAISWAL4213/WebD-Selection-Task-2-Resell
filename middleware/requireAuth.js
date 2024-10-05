const jwt = require('jsonwebtoken'); 
const User = require('../models/userModel');

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  // Check if authorization header exists
  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  // Extract token from the authorization header
  const token = authorization.split(' ')[1];

  try {
    // Verify the token and extract the user ID
    const { _id } = jwt.verify(token, process.env.SECRET);

    // Find the user by ID and select relevant fields
    req.user = await User.findById(_id).select('_id email contactInfo location transactionHistory role'); 

    // Check if user exists
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Allow any authenticated user to manage likes, favorites, and cart
    // Check for paths related to likes, favorites, and cart
    const isLikesOrFavoritesOrCartRoute = req.path.includes('/likes') || 
                                          req.path.includes('/favorites') || 
                                          req.path.includes('/add')||
                                          req.path.includes('/update')||
                                          req.path.includes('/remove');

    if (req.method === 'POST' && isLikesOrFavoritesOrCartRoute) {
      return next(); // Allow adding to likes, favorites, or cart
    }

    if (req.method === 'DELETE' && isLikesOrFavoritesOrCartRoute) {
      return next(); // Allow removing from likes, favorites, or cart
    }


    // Allow both buyers and sellers to checkout
    if (req.method === 'POST' && req.path.includes('/checkout/')) {
      return next(); // Allow buyers and sellers to checkout
    }


    // Role-based logic: restrict certain routes for sellers only
    if (['POST', 'DELETE'].includes(req.method)) {
      if (req.user.role !== 'seller') {
        return res.status(403).json({ error: 'Unauthorized: Only sellers can perform this action' });
      }
    }

    // Allow all users to update their profiles
    if (req.method === 'PUT' && req.path.includes('/profile')) {
      return next(); // Allow profile updates for all users
    }

    // Proceed to the next middleware if everything is valid
    next();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;
