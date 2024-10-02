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
router.post('/add/:productId', addToCart);

// Route to update an item in the cart
router.put('/update/:productId', updateCart);

// Route to remove an item from the cart
router.delete('/remove/:productId', removeFromCart);

// Route to view the cart
router.get('/', viewCart);

module.exports = router;
