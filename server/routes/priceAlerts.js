const express = require('express');
const router = express.Router();
const PriceAlert = require('../models/PriceAlert');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   GET /api/alerts
// @desc    Get all price alerts for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    
    // Get optional status filter
    const { active } = req.query;
    let query = { userId };
    
    // Filter by active status if provided
    if (active !== undefined) {
      query.isActive = active === 'true';
    }
    
    // Find alerts for this user
    const alerts = await PriceAlert.find(query).sort({ createdAt: -1 });
    
    // Get the product details for each alert
    const productIds = alerts.map(alert => alert.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    
    // Combine alert info with product details
    const alertsWithDetails = alerts.map(alert => {
      const product = products.find(p => p._id.toString() === alert.productId.toString());
      return {
        _id: alert._id,
        userId: alert.userId,
        productId: alert.productId,
        targetPrice: alert.targetPrice,
        isActive: alert.isActive,
        createdAt: alert.createdAt,
        notifiedAt: alert.notifiedAt,
        product: product || null
      };
    });
    
    res.json(alertsWithDetails);
  } catch (error) {
    console.error('Error fetching price alerts:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/alerts
// @desc    Create a new price alert
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, targetPrice } = req.body;
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if already has an active alert for this product
    const existingAlert = await PriceAlert.findOne({ 
      userId, 
      productId,
      isActive: true
    });
    
    if (existingAlert) {
      return res.status(400).json({ 
        message: 'You already have an active price alert for this product',
        alert: existingAlert
      });
    }
    
    // Create new alert
    const newAlert = new PriceAlert({
      userId,
      productId,
      targetPrice,
      isActive: true
    });
    
    const alert = await newAlert.save();
    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating price alert:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete a price alert
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await PriceAlert.findById(req.params.id);
    
    if (!alert) {
      return res.status(404).json({ message: 'Price alert not found' });
    }
    
    // Make sure user owns the alert
    if (alert.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await alert.deleteOne();
    
    res.json({ message: 'Price alert removed' });
  } catch (error) {
    console.error('Error deleting price alert:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Price alert not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
