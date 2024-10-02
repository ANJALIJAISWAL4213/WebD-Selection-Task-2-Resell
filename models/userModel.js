// const mongoose = require('mongoose'); 
// const bcrypt = require('bcrypt');
// const validator = require('validator');

// const Transaction = require('./transactionModel');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, 'Please enter a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [8, 'Minimum password length is 8 characters'],
//   },
//   role: {
//     type: String,
//     enum: ['user', 'seller'],
//     default: 'user',
//   },
//   contactInfo: {
//     type: String,
//     required: [true, 'Contact information is required'],
//   },
//   location: {
//     type: String,
//   },
//   transactionHistory: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Transaction',  
//   }],
//   favorites: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',  // Reference to Product model
//   }],
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',  // Reference to Product model
//   }],
// }, { timestamps: true });  

// userSchema.pre('save', async function(next) {
//   const user = this;

//   if (user.isModified('password')) {
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(user.password, salt);
//   }

//   next();
// });

// userSchema.statics.signup = async function (email, password, contactInfo) {
//   if (!email || !password || !contactInfo) {
//     throw Error('All fields must be filled');
//   }
  
//   if (!validator.isEmail(email)) {
//     throw Error('Invalid email');
//   }
  
//   if (!validator.isStrongPassword(password)) {
//     throw Error('Password must be stronger (e.g., include numbers, symbols, etc.)');
//   }

//   const exists = await this.findOne({ email });
//   if (exists) {
//     throw Error('Email already in use');
//   }

//   const user = await this.create({ email, password, contactInfo });
//   return user;
// };

// userSchema.statics.login = async function (email, password) {
//   if (!email || !password) {
//     throw Error('All fields must be filled');
//   }

//   const user = await this.findOne({ email });
//   if (!user) {
//     throw Error('Incorrect email');
//   }

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) {
//     throw Error('Incorrect password');
//   }

//   return user;
// };

// module.exports = mongoose.model('User', userSchema);



//wrong
// const mongoose = require('mongoose'); 
// const bcrypt = require('bcrypt');
// const validator = require('validator');

// const Transaction = require('./transactionModel');

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: [true, 'Email is required'],
//     unique: true,
//     lowercase: true,
//     validate: [validator.isEmail, 'Please enter a valid email']
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//     minlength: [8, 'Minimum password length is 8 characters'],
//   },
//   role: {
//     type: String,
//     enum: ['user', 'seller'],
//     default: 'user',
//   },
//   contactInfo: {
//     type: String,
//     required: [true, 'Contact information is required'],
//   },
//   location: {
//     type: String,
//   },
//   transactionHistory: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Transaction',  
//   }],
//   favorites: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',  
//   }],
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',  
//   }],
//   cart: [{
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Product',
//       required: true,
//     },
//     quantity: {
//       type: Number,
//       required: true,
//       default: 1,
//     },
//   }],
// }, { timestamps: true });  

// module.exports = mongoose.model('User', userSchema);





const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const Transaction = require('./transactionModel');

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
    enum: ['user', 'seller'],
    default: 'user',
  },
  contactInfo: {
    type: String,
    required: [true, 'Contact information is required'],
  },
  location: {
    type: String,
  },
  transactionHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
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
userSchema.statics.signup = async function(email, password, contactInfo) {
  const user = await this.create({ email, password, contactInfo });
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
