const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/users
// @desc    Get all users (admin route)
// @access  Private (admin only, to be implemented with auth middleware)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (to be implemented with auth middleware)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users
// @desc    Register a user
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // For a real application, you would hash the password here
    // const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    user = new User({
      name,
      email,
      passwordHash: password // In real app, use hashedPassword
    });
    
    await user.save();
    
    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      joinDate: user.joinDate,
      preferences: user.preferences
    };
    
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (to be implemented with auth middleware)
router.put('/:id', async (req, res) => {
  try {
    const { name, email, profilePic, preferences } = req.body;
    
    // Build update object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (profilePic) userFields.profilePic = profilePic;
    if (preferences) userFields.preferences = preferences;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true, runValidators: true }
    ).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(400).json({ message: error.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private (to be implemented with auth middleware)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User removed' });
  } catch (error) {
    console.error('Error deleting user:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
