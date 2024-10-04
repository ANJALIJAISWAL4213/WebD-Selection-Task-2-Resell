
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
  addToCart,
  updateCart,
  removeFromCart,
  viewCart,
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

// Route to add an item to the cart
// This route is accessible to both buyers and sellers
router.post('/add/:productId', addToCart);

// Route to update an item in the cart
// This route is accessible to both buyers and sellers
router.put('/update/:productId', updateCart);

// Route to remove an item from the cart
// This route is accessible to both buyers and sellers
router.delete('/remove/:productId', removeFromCart);

// Route to view the cart
// This route is accessible to both buyers and sellers
router.get('/', viewCart);

module.exports = router;
