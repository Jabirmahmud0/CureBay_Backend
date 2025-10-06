// middleware/userSync.js
const { verifyToken } = require('../controllers/authController');
const UserSyncService = require('../services/userSyncService');
const User = require('../models/User');

// Utility function to sanitize email
const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  // Basic email sanitization
  return email.trim().toLowerCase();
};

/**
 * Middleware to sync Firebase user with MongoDB user
 * Ensures user data is up-to-date before processing requests
 */
async function syncUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const idToken = authHeader.split(' ')[1];
    
    // Verify and decode the token
    const decoded = await verifyToken(idToken, null);
    
    // Validate decoded token data
    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: 'Invalid token data' });
    }
    
    // Sanitize email
    const sanitizedEmail = sanitizeEmail(decoded.email);
    if (!sanitizedEmail) {
      return res.status(401).json({ error: 'Invalid email in token' });
    }
    
    // Update decoded token with sanitized email
    decoded.email = sanitizedEmail;
    
    // Sync user data with Firebase using the service
    const user = await UserSyncService.syncUser(decoded);
    
    const validationResult = UserSyncService.validateUserSession(user);
    if (!validationResult.isValid) {
      return res.status(401).json({ error: validationResult.reason });
    }
    
    // Attach user to request object
    req.user = user;
    req.firebaseUser = decoded;
    
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Middleware to validate user session without syncing
 * Useful for frequent checks where full sync is not needed
 */
async function validateUserSession(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const idToken = authHeader.split(' ')[1];
    
    // Verify and decode the token
    const decoded = await verifyToken(idToken, null);
    
    // Validate decoded token data
    if (!decoded || !decoded.email) {
      return res.status(401).json({ error: 'Invalid token data' });
    }
    
    // Sanitize email
    const sanitizedEmail = sanitizeEmail(decoded.email);
    if (!sanitizedEmail) {
      return res.status(401).json({ error: 'Invalid email in token' });
    }
    
    // Update decoded token with sanitized email
    decoded.email = sanitizedEmail;
    
    // Just validate the existing user without syncing
    const user = await User.findOne({ email: sanitizedEmail });
    const validationResult = UserSyncService.validateUserSession(user);
    
    if (!validationResult.isValid) {
      return res.status(401).json({ error: validationResult.reason });
    }
    
    // Attach user to request object
    req.user = user;
    req.firebaseUser = decoded;
    
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { syncUser, validateUserSession };