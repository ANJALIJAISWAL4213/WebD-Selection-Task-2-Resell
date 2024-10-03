const Review = require('../models/reviewModel');
const Transaction = require('../models/transactionModel'); // Import the Transaction model

const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body; // Destructure request body
  const userId = req.user.id; // Get user ID from authenticated request

  try {
    // Check if the user has purchased the product
    const transaction = await Transaction.findOne({
      userId,
      'items.productId': productId,
    });

    // If no transaction is found for the product, return an error
    if (!transaction) {
      return res.status(403).json({
        message: 'You can only review products you have purchased.',
      });
    }

    // Create the review
    const review = await Review.create({
      userId,
      productId, // Ensure productId is used here
      rating,
      comment,
    });

    // Return success response
    res.status(201).json({
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    // Return server error
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = { createReview };
