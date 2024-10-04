const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Transaction = require('./transactionModel'); // Ensure the Transaction model is imported

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Minimum password length is 8 characters'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: ['user', 'seller'],
    default: 'user',
  },
  contactInfo: {
    type: String,
    required: [true, 'Contact information is required'], // Removed duplication
  },
  location: {
    type: String,
  },
  transactionHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction', // Reference to the Transaction model
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  cart: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  }],
}, { timestamps: true });

// Static method for signup
userSchema.statics.signup = async function(email, password, role, contactInfo) {
  const user = await this.create({ email, password, role, contactInfo }); // Added role
  return user;
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method for login
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Invalid email or password');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw Error('Invalid email or password');
  }
  return user;
};

module.exports = mongoose.model('User', userSchema);
