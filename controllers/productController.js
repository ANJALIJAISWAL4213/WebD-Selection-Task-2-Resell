// const Product = require('../models/productModel');

// // Create a new product (Seller Only)
// const createProduct = async (req, res) => {
//   try {
//     // Ensure the user is a seller
//     if (req.user.role !== 'seller') {
//       return res.status(403).json({ error: 'Unauthorized: Only sellers can create products' });
//     }

//     const { name, description, price } = req.body;
//     const sellerId = req.user._id;

//     const newProduct = await Product.create({ name, description, price, seller: sellerId });
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get all products (Accessible to both buyers and sellers)
// const getProducts = async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const products = await Product.find()
//       .limit(limit * 1)
//       .skip((page - 1) * limit)
//       .exec();

//     const count = await Product.countDocuments();

//     res.json({
//       products,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Update a product (Seller Only)
// const updateProduct = async (req, res) => {
//   const { name, description, price } = req.body;
//   const { id } = req.params; // Product ID from URL

//   try {
//     // Find the product by ID
//     const product = await Product.findById(id);

//     // Check if the product exists
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Check if the authenticated user is the seller of the product
//     if (product.seller.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Unauthorized: Only the seller can update this product' });
//     }

//     // Update the product details
//     product.name = name || product.name; // Allow partial updates
//     product.description = description || product.description;
//     product.price = price || product.price;

//     // Save the updated product
//     await product.save();

//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };

// // Delete a product (Seller Only)
// const deleteProduct = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Find the product by ID
//     const product = await Product.findById(id);

//     // Check if the product exists
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Check if the authenticated user is the seller of the product
//     if (product.seller.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Unauthorized: Only the seller can delete this product' });
//     }

//     // Delete the product
//     await product.remove();

//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// };


// // Export all the controller functions
// module.exports = {
//   createProduct,
//   getProducts,
//   updateProduct,
//   deleteProduct
// };



const Product = require('../models/productModel');

// Create a new product (Seller Only)
const createProduct = async (req, res) => {
  try {
    // Ensure the user is a seller
    if (req.user.role !== 'seller') {
      return res.status(403).json({ error: 'Unauthorized: Only sellers can create products' });
    }

    const { name, description, price, category, location } = req.body; // Added category and location fields
    const sellerId = req.user._id;

    const newProduct = await Product.create({ name, description, price, category, location, seller: sellerId });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products (Accessible to both buyers and sellers)
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await Product.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Product.countDocuments();

    res.json({
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Search and filter products (Accessible to both buyers and sellers)
const searchProducts = async (req, res) => {
  try {
    const { name, category, location, minPrice, maxPrice } = req.query;

    // Create filter object
    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: 'i' }; // case-insensitive search
    }
    if (category) {
      filter.category = { $regex: category, $options: 'i' }; // case-insensitive search for category
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // case-insensitive search for location
    }
    if (minPrice && maxPrice) {
      filter.price = { $gte: minPrice, $lte: maxPrice }; // between minPrice and maxPrice
    } else if (minPrice) {
      filter.price = { $gte: minPrice };
    } else if (maxPrice) {
      filter.price = { $lte: maxPrice };
    }

    // Fetch products based on filter
    const products = await Product.find(filter);

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update a product (Seller Only)
const updateProduct = async (req, res) => {
  const { name, description, price, category, location } = req.body; // Added category and location
  const { id } = req.params; // Product ID from URL

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the authenticated user is the seller of the product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Only the seller can update this product' });
    }

    // Update the product details
    product.name = name || product.name; // Allow partial updates
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category; // Allow partial updates for category
    product.location = location || product.location; // Allow partial updates for location

    // Save the updated product
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a product (Seller Only)
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the product by ID
    const product = await Product.findById(id);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the authenticated user is the seller of the product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized: Only the seller can delete this product' });
    }

    // Delete the product
    await product.remove();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Export all the controller functions
module.exports = {
  createProduct,
  getProducts,
  searchProducts, // Export the new searchProducts function
  updateProduct,
  deleteProduct
};

