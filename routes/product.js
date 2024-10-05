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

// New routes for featured listings
router.post('/:id/feature', requireAuth, productController.featureProduct); // Feature a product (Seller only)
router.post('/:id/unfeature', requireAuth, productController.unfeatureProduct); // Unfeature a product (Seller only)
router.get('/featured', productController.getFeaturedProducts); // Get all featured products (Everyone can access)


module.exports = router;
