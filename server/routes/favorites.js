const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// @route   GET /api/favorites
// @desc    Get all favorites for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.query.userId || req.user.id;
    
    // Find all favorites for this user
    const favorites = await Favorite.find({ userId });
    
    // Get the product details for each favorite
    const productIds = favorites.map(fav => fav.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    
    // Combine favorite info with product details
    const favoritesWithDetails = favorites.map(favorite => {
      const product = products.find(p => p._id.toString() === favorite.productId.toString());
      return {
        _id: favorite._id,
        userId: favorite.userId,
        productId: favorite.productId,
        createdAt: favorite.createdAt,
        product: product || null
      };
    });
    
    res.json(favoritesWithDetails);
  } catch (error) {
    console.error('Error fetching favorites:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/favorites
// @desc    Add a product to favorites
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    
    // Check if already favorited
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }
    
    // Create new favorite
    const newFavorite = new Favorite({
      userId,
      productId
    });
    
    const favorite = await newFavorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error adding to favorites:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/favorites/:id
// @desc    Remove a product from favorites
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    
    // Make sure user owns the favorite
    if (favorite.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await favorite.deleteOne();
    
    res.json({ message: 'Product removed from favorites' });
  } catch (error) {
    console.error('Error removing from favorites:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
