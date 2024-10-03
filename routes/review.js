
const express = require('express');
const { createReview } = require('../controllers/reviewController'); // Change this to use createReview
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Middleware to check authentication before submitting reviews
router.use(requireAuth);

// Route to handle review submission
router.post('/', async (req, res) => {
    try {
        // Ensure the createReview controller is defined
        await createReview(req, res); // Change to createReview
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ message: 'Server error while submitting review.' });
    }
});

module.exports = router;
