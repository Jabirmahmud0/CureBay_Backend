// middleware/sellerAuth.js
const { verifyToken } = require('../controllers/authController');
const User = require('../models/User');
const UserSyncService = require('../services/userSyncService');

/**
 * Middleware to check if user is seller or admin with real-time sync
 */
async function requireSellerOrAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const idToken = authHeader.split(' ')[1];
    const decoded = await verifyToken(idToken);
    
    // Sync user data with Firebase
    const user = await UserSyncService.syncUser(decoded);
    
    // Validate user session
    const validationResult = UserSyncService.validateUserSession(user);
    if (!validationResult.isValid) {
      return res.status(401).json({ error: validationResult.reason });
    }
    
    // Check if user is seller or admin
    if (user.role !== 'seller' && user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Seller or admin privileges required.' });
    }
    
    // Attach user to request object
    req.user = user;
    req.firebaseUser = decoded;
    
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token', details: err.message });
  }
}

module.exports = { requireSellerOrAdmin };