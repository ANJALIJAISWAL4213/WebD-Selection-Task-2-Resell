// const express = require('express');
// const router = express.Router();
// const productController = require('../controllers/productController');
// const requireAuth = require('../middleware/requireAuth'); // Adjusting import to directly use requireAuth

// // Product routes
// router.post('/', requireAuth, productController.createProduct); // Create product (Seller only)
// router.get('/', productController.getProducts);             // Get products (Everyone can access)
// router.put('/:id', requireAuth, productController.updateProduct); // Update product (Seller only)
// router.delete('/:id', requireAuth, productController.deleteProduct); // Delete product (Seller only)

// module.exports = router;



const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const requireAuth = require('../middleware/requireAuth'); // Adjusting import to directly use requireAuth

// Product routes
router.post('/', requireAuth, productController.createProduct); // Create product (Seller only)
router.get('/', productController.getProducts); // Get all products (Everyone can access)
router.get('/search', productController.searchProducts); // Search and filter products (Everyone can access)
router.put('/:id', requireAuth, productController.updateProduct); // Update product (Seller only)
router.delete('/:id', requireAuth, productController.deleteProduct); // Delete product (Seller only)

module.exports = router;
