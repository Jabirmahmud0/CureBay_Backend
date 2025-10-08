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
    console.log('syncUser middleware called');
    
    // If devAuth has already attached a user, skip token verification
    if (req.user && req.firebaseUser) {
      console.log('User already attached by devAuth, skipping token verification');
      return next();
    }
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header found');
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const idToken = authHeader.split(' ')[1];
    console.log('Token extracted from header');
    
    // Verify and decode the token
    const decoded = await verifyToken(idToken, null);
    console.log('Token decoded:', decoded);
    
    // Validate decoded token data
    if (!decoded || !decoded.email) {
      console.log('Invalid token data');
      return res.status(401).json({ error: 'Invalid token data' });
    }
    
    // Sanitize email
    const sanitizedEmail = sanitizeEmail(decoded.email);
    if (!sanitizedEmail) {
      console.log('Invalid email in token');
      return res.status(401).json({ error: 'Invalid email in token' });
    }
    
    // Update decoded token with sanitized email
    decoded.email = sanitizedEmail;
    
    // Sync user data with Firebase using the service
    const user = await UserSyncService.syncUser(decoded);
    console.log('User synced:', user);
    
    const validationResult = UserSyncService.validateUserSession(user);
    if (!validationResult.isValid) {
      console.log('User session invalid:', validationResult.reason);
      return res.status(401).json({ error: validationResult.reason });
    }
    
    // Attach user to request object
    req.user = user;
    req.firebaseUser = decoded;
    
    console.log('User attached to request, proceeding to next middleware');
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
    // If devAuth has already attached a user, skip token verification
    if (req.user && req.firebaseUser) {
      console.log('User already attached by devAuth, skipping token verification in validateUserSession');
      return next();
    }
    
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