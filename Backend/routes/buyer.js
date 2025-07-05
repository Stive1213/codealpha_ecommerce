const express = require('express');
const router = express.Router();
const buy = require('../controllers/buyerController');

// Product browsing
router.get('/products', buy.getAllProducts);
router.get('/products/:id', buy.getProductById);

// Cart
router.post('/cart/add', buy.addToCart);
router.get('/cart/:userId', buy.getCart);
router.delete('/cart/remove/:itemId', buy.removeFromCart);

// Checkout
router.post('/orders/place', buy.placeOrder);

module.exports = router;
