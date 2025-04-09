const express = require('express');
const laptopController = require('../controllers/laptopController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', laptopController.getAllLaptops);
router.get('/:id', laptopController.getLaptop);

// Protected routes (admin and master)
router.use(protect);
router.use(restrictTo('admin', 'master'));

router.post('/', laptopController.createLaptop);
router.put('/:id', laptopController.updateLaptop);
router.delete('/:id', laptopController.deleteLaptop);

module.exports = router;