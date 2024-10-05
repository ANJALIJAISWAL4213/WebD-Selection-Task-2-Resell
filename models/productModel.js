// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
//   seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to seller
// }, { timestamps: true });

// const Product = mongoose.model('Product', productSchema);

// module.exports = Product;




const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    index: true // Indexing to improve search performance
  },
  description: { 
    type: String, 
    required: true,
    trim: true 
  },
  price: { 
    type: Number, 
    required: true,
    index: true // Indexing for price-based filters
  },
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }, // Reference to seller
  category: { 
    type: String, 
    required: true,
    trim: true,
    index: true // Indexing for category-based filtering
  },
  location: { 
    type: String, 
    required: true,
    trim: true,
    index: true // Indexing for location-based filtering
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
