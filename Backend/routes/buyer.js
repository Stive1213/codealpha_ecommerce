const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');

router.get('/products', buyerController.getAllProducts);
router.post('/cart', buyerController.addToCart);
router.get('/cart/:userId', buyerController.getCart);
router.delete('/cart/:cartItemId', buyerController.removeFromCart);
router.post('/checkout/:userId', buyerController.checkout);

module.exports = router;
