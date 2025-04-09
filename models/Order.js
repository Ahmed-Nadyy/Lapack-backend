const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: 'Please provide a valid email'
    }
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{1,14}$/.test(v) || /^[0-9]{10,15}$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },
  laptop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laptop',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: {
    type: Date,
    default: null
  },
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'processing', 'accepted', 'completed', 'cancelled'],
      required: true
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    note: {
      type: String,
      trim: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  shippingAddress: {
    type: String,
    required: true,
    trim: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Middleware to add status change to history
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      updatedBy: this.assignedTo || null,
      note: this.status === 'cancelled' ? 'Order cancelled' : undefined
    });
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function(newStatus, updatedBy, note) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    updatedBy,
    note,
    updatedAt: Date.now()
  });
  if (newStatus !== 'pending') {
    this.assignedTo = updatedBy;
    this.assignedAt = Date.now();
  }
  await this.save();
  return this;
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = async function(newStatus) {
  this.paymentStatus = newStatus;
  await this.save();
  return this;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;