const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getSellerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerOrders,
  getProductById  // <-- add this
} = require('../controllers/productController');

// Public route for all products
router.get('/', getAllProducts);

// Route to get single product by ID
router.get('/:id', getProductById);  // <-- add this route

// Seller-specific routes
router.get('/my', getSellerProducts);
router.post('/add', addProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/orders', getSellerOrders);

module.exports = router;
