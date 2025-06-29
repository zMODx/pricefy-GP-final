// Simple authentication middleware for the prototype
// In a real app, this would use JWT verification

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // In a real app, verify the token with JWT
    // For this prototype, we'll simply use the token as the userId
    req.user = { id: token };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
