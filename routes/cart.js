const express = require('express');
const {
  addToCart,
  updateCart,
  removeFromCart,
  viewCart,
} = require('../controllers/cartController');
const requireAuth = require('../middleware/requireAuth'); // Middleware for authentication

const router = express.Router();

// Require authentication for cart operations
router.use(requireAuth);

// Route to add an item to the cart
router.post('/add/:productId', addToCart); // This route is accessible to both buyers and sellers

// Route to update an item in the cart
router.put('/update/:productId', updateCart); // This route is accessible to both buyers and sellers

// Route to remove an item from the cart
router.delete('/remove/:productId', removeFromCart); // This route is accessible to both buyers and sellers

// Route to view the cart
router.get('/', viewCart); // This route is accessible to both buyers and sellers

module.exports = router;

