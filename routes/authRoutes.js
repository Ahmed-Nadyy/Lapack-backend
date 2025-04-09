const express = require('express');
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);

// Protected routes (master only)
router.use(protect);
router.use(restrictTo('master'));

router.post('/admins', authController.addAdmin);
router.get('/admins', authController.getAllAdmins);
router.patch('/admins/:id', authController.updateAdminStatus);

module.exports = router;