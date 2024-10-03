const User = require('../models/userModel'); // User model
const Product = require('../models/productModel'); // Product model
const Transaction = require('../models/transactionModel'); // Transaction model
const { v4: uuidv4 } = require('uuid'); // Import uuid for generating unique invoice numbers

const checkout = async (req, res) => {
  const userId = req.user.id; // Get user ID from authenticated request
  const { paymentMethod, billingAddress } = req.body; // Get payment method and billing address from request body

  try {
    // Find the user and populate their cart
    const user = await User.findById(userId).populate('cart.productId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the cart is empty
    if (user.cart.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = user.cart.reduce((total, item) => total + (item.productId.price * item.quantity), 0);

    // Create a transaction record
    const transaction = await Transaction.create({
      userId: userId,
      items: user.cart, // Correctly reference the cart items
      paymentMethod: paymentMethod,
      billingAddress: billingAddress,
      totalAmount: totalAmount, // Use calculated total amount
      invoiceNumber: uuidv4(), // Generate a unique invoice number
    });

    // Update the user's transaction history by pushing the new transaction ID
    user.transactionHistory.push(transaction._id); // Assuming transactionHistory is an array of transaction IDs in the User model
    await user.save(); // Save the user to persist changes

    // Clear the user's cart after successful checkout
    user.cart = [];
    await user.save();

    res.status(200).json({
      message: 'Checkout successful',
      transaction: transaction, // Send transaction details back to user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { checkout }; // Ensure checkout is exported
