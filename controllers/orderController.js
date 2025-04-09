const Order = require('../models/Order');
const Laptop = require('../models/Laptop');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, laptopId } = req.body;

    // Check if laptop exists and is in stock
    const laptop = await Laptop.findById(laptopId);
    if (!laptop) {
      return res.status(404).json({
        message: 'Laptop not found'
      });
    }

    if (!laptop.inStock) {
      return res.status(400).json({
        message: 'Laptop is out of stock'
      });
    }

    // Create order
    const order = await Order.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      laptop: laptopId
    });

    res.status(201).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    let query = {};
    
    // If regular admin, only show orders assigned to them
    if (req.user.role === 'admin') {
      query = { assignedTo: req.user._id };
    }

    const orders = await Order.find(query)
      .populate('laptop')
      .populate('assignedTo', 'email')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      data: { orders }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get order history (admin only)
exports.getOrderHistory = async (req, res) => {
  try {
    let query = { status: 'completed' };
    
    // If regular admin, only show orders assigned to them
    if (req.user.role === 'admin') {
      query.assignedTo = req.user._id;
    }

    const orders = await Order.find(query)
      .populate('laptop')
      .populate('assignedTo', 'email')
      .sort('-updatedAt');

    res.status(200).json({
      status: 'success',
      data: { orders }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error fetching order history',
      error: error.message
    });
  }
};

// Assign order to admin
exports.assignOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // Check if order is already assigned
    if (order.assignedTo) {
      return res.status(400).json({
        message: 'Order is already assigned'
      });
    }

    order.assignedTo = req.user._id;
    order.status = 'accepted';
    await order.save();

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error assigning order',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    // Check if user has permission to update
    if (req.user.role !== 'master' && 
        order.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You do not have permission to update this order'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      status: 'success',
      data: { order }
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error updating order status',
      error: error.message
    });
  }
};