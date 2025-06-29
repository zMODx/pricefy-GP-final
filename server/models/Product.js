const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  currentPrice: {
    type: Number,
    required: [true, 'Current price is required']
  },
  store: {
    type: String,
    required: [true, 'Store name is required'],
    enum: ['Trendyol', 'Hepsiburada', 'N11', 'Amazon']
  },
  description: {
    type: String
  },
  imageUrl: {
    type: String,
    required: [true, 'Product image URL is required']
  },
  originalPrice: {
    type: Number
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  storeUrl: {
    type: String,
    required: [true, 'Store URL is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required']
  },
  availability: {
    type: String,
    default: 'In Stock'
  },
  features: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
