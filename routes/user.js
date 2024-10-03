
const express = require('express');

const {
  loginUser,
  signupUser,
  getUserProfile,
  updateUserProfile,
  addToFavorites,
  removeFromFavorites,
  addToLikes,
  removeFromLikes,
} = require('../controllers/userController');

const requireAuth = require('../middleware/requireAuth'); // Correct import

const router = express.Router();

// User authentication routes
router.post('/login', loginUser);
router.post('/signup', signupUser);

// Apply authentication middleware for the following routes
router.use(requireAuth);

// User profile routes
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

// Favorites routes
router.post('/favorites/:productId', addToFavorites); // Add product to favorites
router.delete('/favorites/:productId', removeFromFavorites); // Remove product from favorites

// Likes routes
router.post('/likes/:productId', addToLikes); // Add product to likes
router.delete('/likes/:productId', removeFromLikes); // Remove product from likes

module.exports = router;
