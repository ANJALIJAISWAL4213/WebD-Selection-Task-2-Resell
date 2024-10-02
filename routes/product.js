const express = require('express');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const requireAuth = require('../middleware/requireAuth'); // Ensure the user is authenticated

const router = express.Router();

router.use(requireAuth); 

router.post('/', createProduct);

router.get('/', getProducts);

router.put('/:id', updateProduct);

router.delete('/:id', deleteProduct);

module.exports = router;
