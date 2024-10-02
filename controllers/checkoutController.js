
// const User = require('../models/userModel'); // User model
// const Product = require('../models/productModel'); // Product model
// const Transaction = require('../models/transactionModel'); // Transaction model

// const checkout = async (req, res) => {
//   const userId = req.user.id; // Get user ID from authenticated request
//   const { paymentMethod, billingAddress } = req.body; // Get payment method and billing address from request body

//   try {
//     // Find the user and populate their cart
//     const user = await User.findById(userId).populate('cart.productId');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if the cart is empty
//     if (user.cart.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     // Calculate total amount based on cart items
//     const totalAmount = user.cart.reduce((total, item) => {
//       return total + (item.productId.price * item.quantity);
//     }, 0);

//     // Create a transaction record
//     const transaction = await Transaction.create({
//       userId: userId,
//       products: user.cart.map(item => ({
//         productId: item.productId._id,
//         quantity: item.quantity,
//         price: item.productId.price,
//       })),
//       paymentMethod: paymentMethod,
//       billingAddress: billingAddress,
//       totalAmount: totalAmount, // Total amount calculated
//       status: 'Completed', // Transaction status
//     });

//     // Clear the user's cart after successful checkout
//     user.cart = [];
//     await user.save();

//     res.status(200).json({
//       message: 'Checkout successful',
//       transaction: transaction, // Send transaction details back to user
//     });
//   } catch (error) {
//     console.error('Checkout error:', error); // Log the error for debugging
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// module.exports = { checkout }; // Export the checkout function



// checkoutController.js
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

    // Create a transaction record
    const transaction = await Transaction.create({
      userId: userId,
      products: user.cart,
      paymentMethod: paymentMethod,
      billingAddress: billingAddress,
      totalAmount: user.cart.reduce((total, item) => total + (item.productId.price * item.quantity), 0), // Calculate total amount
      status: 'Completed', // Mock transaction status
      invoiceNumber: uuidv4(), // Generate a unique invoice number
    });

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
