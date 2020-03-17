const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controllers/OrderController');

// Handle incoming GET requests to /orders
router.get('/', OrderController.index);
router.post('/', checkAuth, OrderController.create);
router.get('/:orderId', OrderController.show);
router.delete('/:orderId', checkAuth, OrderController.destroy);

module.exports = router;