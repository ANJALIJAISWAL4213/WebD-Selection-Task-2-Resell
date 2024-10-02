// const User = require('../models/userModel'); // Assuming User model has cart related schema
// const Product = require('../models/productModel'); // Assuming Product model exists

// // Add item to cart
// const addToCart = async (req, res) => {
//   const { productId, quantity } = req.body; // Expecting productId and quantity in the request body
//   const userId = req.user.id; // Extract user ID from the authenticated request

//   try {
//     // Find the product to ensure it exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Find the user and add the product to their cart
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check if the product already exists in the cart
//     const existingProductIndex = user.cart.findIndex(item => item.productId.toString() === productId);
//     if (existingProductIndex > -1) {
//       // If the product is already in the cart, update the quantity
//       user.cart[existingProductIndex].quantity += quantity;
//     } else {
//       // Otherwise, add a new item to the cart
//       user.cart.push({ productId, quantity });
//     }

//     await user.save();
//     res.status(200).json({ message: 'Item added to cart', cart: user.cart });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Update item in cart
// const updateCart = async (req, res) => {
//   const { productId, quantity } = req.body; // Expecting productId and new quantity

//   const userId = req.user.id;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Find the product in the cart
//     const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);
//     if (productIndex > -1) {
//       user.cart[productIndex].quantity = quantity; // Update quantity
//       await user.save();
//       res.status(200).json({ message: 'Cart updated', cart: user.cart });
//     } else {
//       res.status(404).json({ message: 'Product not found in cart' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Remove item from cart
// const removeFromCart = async (req, res) => {
//   const { productId } = req.body; // Expecting productId to remove

//   const userId = req.user.id;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Filter out the item to be removed
//     user.cart = user.cart.filter(item => item.productId.toString() !== productId);
//     await user.save();
//     res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // View cart
// const viewCart = async (req, res) => {
//   const userId = req.user.id;

//   try {
//     const user = await User.findById(userId).populate('cart.productId'); // Populate product details if needed
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ cart: user.cart });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// module.exports = { addToCart, updateCart, removeFromCart, viewCart };




const User = require('../models/userModel'); // Assuming User model has cart-related schema
const Product = require('../models/productModel'); // Assuming Product model exists

// Add item to cart
const addToCart = async (req, res) => {
  const { quantity } = req.body; // Expecting quantity in the request body
  const { productId } = req.params; // Extract productId from request parameters
  const userId = req.user._id; // Extract user ID from the authenticated request

  try {
    // Find the product to ensure it exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user and add the product to their cart
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = user.cart.findIndex(item => item.productId.toString() === productId);
    if (existingProductIndex > -1) {
      // If the product is already in the cart, update the quantity
      user.cart[existingProductIndex].quantity += quantity;
    } else {
      // Otherwise, add a new item to the cart
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json({ message: 'Item added to cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update item in cart
const updateCart = async (req, res) => {
  const { quantity } = req.body; // Expecting new quantity
  const { productId } = req.params; // Extract productId from request parameters
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the product in the cart
    const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);
    if (productIndex > -1) {
      user.cart[productIndex].quantity = quantity; // Update quantity
      await user.save();
      res.status(200).json({ message: 'Cart updated', cart: user.cart });
    } else {
      res.status(404).json({ message: 'Product not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  const { productId } = req.params; // Expecting productId to remove from request parameters
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Filter out the item to be removed
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();
    res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// View cart
const viewCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate('cart.productId'); // Populate product details if needed
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { addToCart, updateCart, removeFromCart, viewCart };
