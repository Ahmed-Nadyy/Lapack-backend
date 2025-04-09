const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
  manufacturer: {
    type: String,
    required: true,
    trim: true,
    enum: ['Dell', 'Lenovo', 'HP', 'Asus', 'Acer', 'Apple', 'MSI', 'Other']
  },
  categories: {
    type: [{
      type: String,
      enum: ['Programming', 'Engineering', 'Gaming', 'Business', 'Student', 'General']
    }],
    required: true,
    validate: [array => array.length > 0, 'At least one category must be selected']
  },
  images: [{
    type: String,
    required: true
  }],
  name: {
    type: String,
    required: true,
    trim: true
  },
  processor: {
    type: String,
    required: true,
    trim: true
  },
  ram: {
    type: String,
    required: true,
    trim: true
  },
  storage: {
    type: String,
    required: true,
    trim: true
  },
  screen: {
    type: String,
    required: true,
    trim: true
  },
  additionalDetails: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted price
laptopSchema.virtual('discountedPrice').get(function() {
  if (this.discount <= 0) return this.price;
  return this.price - (this.price * this.discount / 100);
});

// Method to update stock
laptopSchema.methods.updateStock = function(quantity) {
  this.stockQuantity += quantity;
  if (this.stockQuantity <= 0) {
    this.inStock = false;
  } else {
    this.inStock = true;
  }
  return this.save();
};

const Laptop = mongoose.model('Laptop', laptopSchema);

module.exports = Laptop;