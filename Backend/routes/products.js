const express = require('express');
const router = express.Router();
const {
  getSellerProducts,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { getSellerOrders } = require('../controllers/productController');


router.get('/my', getSellerProducts);
router.post('/add', addProduct);
router.put('/update/:id', updateProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/orders', getSellerOrders); 
module.exports = router;
