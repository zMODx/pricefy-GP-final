const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
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
      passwordHash: password // In a real app, use hashedPassword
    });
    
    await user.save();
    
    // Create a simple session token (in a real app, use JWT)
    const token = user._id.toString();
    
    // Return user and token
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    // In a real app, use bcrypt.compare(password, user.passwordHash)
    const isMatch = password === user.passwordHash;
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create a simple session token (in a real app, use JWT)
    const token = user._id.toString();
    
    // Return user and token
    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', async (req, res) => {
  try {
    // In a real app, get user ID from JWT token verification
    // For this prototype, we'll simply use the token directly as the user ID
    const userId = req.header('x-auth-token');
    
    if (!userId) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Get user by ID
    const user = await User.findById(userId).select('-passwordHash');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error getting user data:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
