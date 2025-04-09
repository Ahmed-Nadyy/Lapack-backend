const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res.status(400).json({
        message: 'Please provide email and password'
      });
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email, isActive: true });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        message: 'Incorrect email or password'
      });
    }

    // Generate token
    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Add new admin (master only)
exports.addAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Only master can add new admins
    if (req.user.role !== 'master') {
      return res.status(403).json({
        message: 'Only master admin can add new admins'
      });
    }

    // Create new admin
    const newAdmin = await User.create({
      email,
      password,
      role: 'admin',
      addedBy: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: newAdmin._id,
          email: newAdmin.email,
          role: newAdmin.role
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error adding new admin',
      error: error.message
    });
  }
};

// Update admin status (master only)
exports.updateAdminStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const adminId = req.params.id;

    // Only master can update admin status
    if (req.user.role !== 'master') {
      return res.status(403).json({
        message: 'Only master admin can update admin status'
      });
    }

    // Find and update admin
    const admin = await User.findById(adminId);
    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found'
      });
    }

    if (admin.role === 'master') {
      return res.status(403).json({
        message: 'Cannot modify master admin status'
      });
    }

    admin.isActive = isActive;
    await admin.save();

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: admin._id,
          email: admin.email,
          role: admin.role,
          isActive: admin.isActive
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating admin status',
      error: error.message
    });
  }
};

// Get all admins (master only)
exports.getAllAdmins = async (req, res) => {
  try {
    // Only master can view all admins
    if (req.user.role !== 'master') {
      return res.status(403).json({
        message: 'Only master admin can view all admins'
      });
    }

    const admins = await User.find({ role: 'admin' })
      .select('email role isActive addedBy')
      .populate('addedBy', 'email');

    res.status(200).json({
      status: 'success',
      data: {
        admins
      }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error fetching admins',
      error: error.message
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Use the same JWT_SECRET for verifying tokens
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User no longer exists or is inactive' });
    }

    const newToken = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token: newToken
    });
  } catch (error) {
    console.error('Token refresh error:', error.message);
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};