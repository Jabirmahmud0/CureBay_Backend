"use strict";
// middleware/userSync.js
const { verifyToken } = require('../controllers/authController');
const UserSyncService = require('../services/userSyncService');
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
        const decoded = await verifyToken(idToken);
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
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid or expired token', details: err.message });
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
        const decoded = await verifyToken(idToken);
        // Just validate the existing user without syncing
        const user = await User.findOne({ email: decoded.email });
        const validationResult = UserSyncService.validateUserSession(user);
        if (!validationResult.isValid) {
            return res.status(401).json({ error: validationResult.reason });
        }
        // Attach user to request object
        req.user = user;
        req.firebaseUser = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid or expired token', details: err.message });
    }
}
module.exports = { syncUser, validateUserSession };
