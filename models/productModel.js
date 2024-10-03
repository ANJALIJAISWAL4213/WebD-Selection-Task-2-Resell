const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true, // Trims whitespace from both ends of the string
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true, // Trims whitespace from both ends of the string
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be a positive number'], // Ensure price is not negative
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: [true, 'Seller ID is required'], // Ensure seller ID is provided
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Adding a method to format product data if needed
productSchema.methods.toJSON = function () {
  const product = this;
  const productObject = product.toObject();

  // Customize what is returned in the response
  delete productObject.__v; // Exclude __v from the output

  return productObject;
};

module.exports = mongoose.model('Product', productSchema);
