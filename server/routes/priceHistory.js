const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PriceHistory = require('../models/PriceHistory');
const Product = require('../models/Product');

// @route   GET /api/price-history/:productId
// @desc    Get price history for a specific product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const priceHistory = await PriceHistory.find({ 
      productId: req.params.productId 
    }).sort({ date: -1 });
    
    if (!priceHistory || priceHistory.length === 0) {
      return res.status(404).json({ message: 'No price history found for this product' });
    }
    
    res.json(priceHistory);
  } catch (error) {
    console.error('Error fetching price history:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'No price history found for this product' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/price-history
// @desc    Add new price point to history
// @access  Private (to be implemented with auth middleware)
router.post('/', async (req, res) => {
  try {
    const { productId, price } = req.body;
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Create new price history entry
    const newPricePoint = new PriceHistory({
      productId,
      price,
      date: new Date()
    });
    
    const pricePoint = await newPricePoint.save();
    
    // Update product's current price
    product.currentPrice = price;
    await product.save();
    
    res.status(201).json(pricePoint);
  } catch (error) {
    console.error('Error adding price history:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// @route   GET /api/price-history/product/:productId/analytics
// @desc    Get price analytics (min, max, avg) for a product
// @access  Public
router.get('/product/:productId/analytics', async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Get min, max, and average prices
    const analytics = await PriceHistory.aggregate([
      { $match: { productId: mongoose.Types.ObjectId(productId) } },
      { 
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          avgPrice: { $avg: "$price" },
          count: { $sum: 1 }
        }
      }
    ]);
    
    if (!analytics || analytics.length === 0) {
      return res.status(404).json({ message: 'No price data available for this product' });
    }
    
    res.json(analytics[0]);
  } catch (error) {
    console.error('Error fetching price analytics:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
