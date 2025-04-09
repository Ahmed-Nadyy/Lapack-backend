const express = require('express');
const orderController = require('../controllers/orderController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/', orderController.createOrder);

// Protected routes (admin and master)
router.use(protect);
router.use(restrictTo('admin', 'master'));

router.get('/', orderController.getAllOrders);
router.get('/history', orderController.getOrderHistory);
router.patch('/:id/assign', orderController.assignOrder);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;