const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

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
  const { email, password, contactInfo } = req.body;

  try {
    const user = await User.signup(email, password, contactInfo);

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
      .populate('favorites') // Populate favorites
      .populate('likes'); // Populate likes

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
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { favorites: productId } }, // Add to favorites only if not already present
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
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { favorites: productId } }, // Remove from favorites
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

// Add product to likes
const addToLikes = async (req, res) => {
  const { productId } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $addToSet: { likes: productId } }, // Add to likes only if not already present
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
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { likes: productId } }, // Remove from likes
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

module.exports = {
  signupUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addToFavorites,
  removeFromFavorites,
  addToLikes,
  removeFromLikes,
};
