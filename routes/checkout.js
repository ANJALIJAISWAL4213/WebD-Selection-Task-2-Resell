// const express = require('express');
// const { checkout } = require('../controllers/checkoutController');
// const requireAuth = require('../middleware/requireAuth');

// const router = express.Router();

// // Require authentication for checkout
// router.use(requireAuth);

// // Route to handle checkout
// router.post('/', checkout);

// module.exports = router;



const express = require('express');
const { checkout } = require('../controllers/checkoutController'); // Ensure checkout is properly imported
const requireAuth = require('../middleware/requireAuth'); // Middleware to require authentication

const router = express.Router();

// Require authentication for checkout
router.use(requireAuth);

// Route to handle checkout
router.post('/', checkout); // This will call the checkout function in your controller when a POST request is made

module.exports = router; // Export the router for use in server.js
