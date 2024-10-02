// const express = require('express');
// const {
//   createProduct,
//   getProducts,
//   updateProduct,
//   deleteProduct
// } = require('../controllers/productController');
// const requireAuth = require('../middleware/requireAuth'); // Ensure the user is authenticated

// const router = express.Router();

// // All routes below require the user to be authenticated
// router.use(requireAuth);

// // Route accessible to both buyers and sellers (get all products)
// router.get('/', getProducts);

// // Routes for sellers only (create, update, and delete products)
// router.post('/', requireSellerRole, createProduct);
// router.put('/:id', requireSellerRole, updateProduct);
// router.delete('/:id', requireSellerRole, deleteProduct);

// module.exports = router;


const express = require('express');
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const requireAuth = require('../middleware/requireAuth'); // Ensure the user is authenticated
const requireSellerRole = require('../middleware/requireSellerRole'); // Ensure the user is a seller

const router = express.Router();

// All routes below require the user to be authenticated
router.use(requireAuth);

// Route accessible to both buyers and sellers (get all products)
router.get('/', getProducts);

// Routes for sellers only (create, update, and delete products)
router.post('/', requireSellerRole, createProduct);
router.put('/:id', requireSellerRole, updateProduct);
router.delete('/:id', requireSellerRole, deleteProduct);

module.exports = router;

