const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  }
}, { 
  timestamps: true,
  // Ensure that the combination of userId and productId is unique
  // This prevents a user from adding the same product to favorites multiple times
  index: { 
    unique: true,
    fields: ['userId', 'productId'] 
  }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
