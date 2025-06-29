const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const PriceHistory = require('../models/PriceHistory');
const auth = require('../middleware/auth');
const { paginateResults, searchDocuments, buildFilterQuery, formatError } = require('../utils/database');

// @route   GET /api/products
// @desc    Get all products with search, filter, and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      search, page, limit, sortBy, order,
      minPrice, maxPrice, category, store, brand, rating
    } = req.query;
    
    // Build options for pagination
    const options = {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      sortField: sortBy || 'createdAt',
      sortOrder: order === 'asc' ? 1 : -1
    };
    
    // Handle search
    if (search) {
      const searchFields = ['name', 'description', 'brand', 'category'];
      const result = await searchDocuments(Product, searchFields, search, options);
      return res.json(result);
    }
    
    // Handle filters
    const filters = {
      minPrice, maxPrice, category, store, brand, rating
    };
    
    const filterQuery = buildFilterQuery(filters);
    const result = await paginateResults(Product, filterQuery, options);
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json(formatError(error));
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json(formatError(error));
  }
});

// @route   GET /api/products/:id/price-history
// @desc    Get price history for a product
// @access  Public
router.get('/:id/price-history', async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Get price history
    const priceHistory = await PriceHistory.find({ 
      productId 
    }).sort({ date: -1 });
    
    res.json(priceHistory);
  } catch (error) {
    console.error('Error fetching price history:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json(formatError(error));
  }
});

// @route   POST /api/products
// @desc    Create a product
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const product = await newProduct.save();
    
    // Create initial price history entry
    const priceHistory = new PriceHistory({
      productId: product._id,
      price: product.currentPrice,
      date: new Date()
    });
    await priceHistory.save();
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(400).json(formatError(error));
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if price is being updated
    const oldPrice = product.currentPrice;
    
    // Update product
    Object.assign(product, req.body);
    await product.save();
    
    // If price changed, add to price history
    if (req.body.currentPrice && req.body.currentPrice !== oldPrice) {
      const priceHistory = new PriceHistory({
        productId: product._id,
        price: req.body.currentPrice,
        date: new Date()
      });
      await priceHistory.save();
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(400).json(formatError(error));
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Consider also deleting related price history, favorites, and alerts
    // PriceHistory.deleteMany({ productId: req.params.id });
    
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).json(formatError(error));
  }
});

module.exports = router;
