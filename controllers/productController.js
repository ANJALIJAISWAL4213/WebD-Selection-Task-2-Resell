// const Product = require('../models/productModel'); 

// exports.createProduct = async (req, res) => {
//   try {
//     const { name, description, price } = req.body;
//     const sellerId = req.user._id; 
//     const newProduct = await Product.create({ name, description, price, sellerId });
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


// exports.getProducts = async (req, res) => {
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

// // Update a product
// exports.updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params; 
//     const updates = req.body; 

//     const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
    
//     if (!updatedProduct) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// exports.deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params; 
//     const deletedProduct = await Product.findByIdAndDelete(id);
    
//     if (!deletedProduct) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };




const Product = require('../models/productModel');

// Create a new product (Seller Only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const sellerId = req.user._id; // Retrieve the seller's ID from the authenticated user
    const newProduct = await Product.create({ name, description, price, seller: sellerId });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all products (Accessible to both buyers and sellers)
exports.getProducts = async (req, res) => {
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

// Update a product (Seller Only)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find the product and check if the seller owns it
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    // Ensure the seller updating the product is the owner
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized: Only the seller can update this product' });
    }

    // Update the product
    Object.assign(product, updates);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a product (Seller Only)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product and check if the seller owns it
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Ensure the seller deleting the product is the owner
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized: Only the seller can delete this product' });
    }

    // Delete the product
    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
