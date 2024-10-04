const User = require('../models/userModel');
const Product = require('../models/productModel'); // Ensure you require your Product model
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, password, role, contactInfo } = req.body;

  try {
    const user = await User.signup(email, password, role, contactInfo);

    const token = createToken(user._id);

    res.status(201).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('transactionHistory')
      .populate('favorites')
      .populate('likes');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  const { contactInfo, location } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { contactInfo, location },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add product to favorites
const addToFavorites = async (req, res) => {
  const { productId } = req.params;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: productId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Remove product from favorites
const removeFromFavorites = async (req, res) => {
  const { productId } = req.params;

  try {
    // Convert productId to ObjectId if necessary
    const productObjectId = mongoose.Types.ObjectId(productId);

    // Retrieve the user
    const user = await User.findById(req.user.id);
    console.log('User found:', user);

    // Check if the user was found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product is not in favorites
    if (!user.favorites.includes(productObjectId)) {
      return res.status(400).json({ message: 'Product not in favorites' });
    }

    // Remove the product from favorites
    user.favorites = user.favorites.filter(id => !id.equals(productObjectId)); // Use equals for ObjectId comparison
    await user.save();
    console.log('Favorites after removal:', user.favorites);

    res.json(user);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add product to likes
const addToLikes = async (req, res) => {
  const { productId } = req.params;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { likes: productId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Remove product from likes
const removeFromLikes = async (req, res) => {
  const { productId } = req.params;

  try {
    // Convert productId to ObjectId if necessary
    const productObjectId = mongoose.Types.ObjectId(productId);

    // Check if the product exists before removing it from likes
    const product = await Product.findById(productObjectId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the product is in the user's likes
    if (!user.likes.includes(productObjectId)) {
      return res.status(403).json({ message: 'You can only remove products you have liked' });
    }

    // Remove the product from likes
    user.likes = user.likes.filter(id => !id.equals(productObjectId)); // Use equals for ObjectId comparison
    await user.save();

    res.json(user);
  } catch (error) {
    console.error('Error removing from likes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add product to cart
const addToCart = async (req, res) => {
  const { productId } = req.params; // Extract productId from request parameters

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { cart: { productId, quantity: 1 } } }, // Add product with default quantity of 1
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Item added to cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update item in cart
const updateCart = async (req, res) => {
  const { productId } = req.params; // Extract productId from request parameters
  const { quantity } = req.body; // Expecting new quantity

  try {
    const user = await User.findById(req.user.id);
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
// Remove item from cart
const removeFromCart = async (req, res) => {
  const { productId } = req.params; // Expecting productId to remove from request parameters

  try {
    // Find the user and check if the product exists in their cart
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the product in the cart
    const productIndex = user.cart.findIndex(item => item.productId.toString() === productId);
    
    // If the product is not in the cart, return an error
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Remove the product from the cart
    user.cart.splice(productIndex, 1); // Remove the item from the cart array
    await user.save(); // Save the updated user document

    res.status(200).json({ message: 'Item removed from cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// View cart
const viewCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId'); // Populate product details if needed
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addToFavorites,
  removeFromFavorites,
  addToLikes,
  removeFromLikes,
  addToCart, updateCart, removeFromCart, viewCart,
};
