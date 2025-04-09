const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['master', 'admin'],
    default: 'admin'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.role === 'admin';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: {
    canAddLaptops: {
      type: Boolean,
      default: function() {
        return this.role === 'master' || this.role === 'admin';
      }
    },
    canDeleteLaptops: {
      type: Boolean,
      default: function() {
        return this.role === 'master' || this.role === 'admin';
      }
    },
    canManageAdmins: {
      type: Boolean,
      default: function() {
        return this.role === 'master';
      }
    },
    canManageOrders: {
      type: Boolean,
      default: function() {
        return this.role === 'master' || this.role === 'admin';
      }
    }
  },
  assignedOrders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;