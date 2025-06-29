const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'Date is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  }
}, { timestamps: true });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
