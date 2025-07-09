const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getSellerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getSellerOrders,
  getProductById
} = require('../controllers/productController');

// Public route for all products
router.get('/', getAllProducts);

// Seller-specific routes — put this BEFORE the /:id route
router.get('/my', getSellerProducts);
router.post('/add', addProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/orders', getSellerOrders);

// Route to get single product by ID — must be AFTER /my and other specific routes
router.get('/:id', getProductById);

module.exports = router;
