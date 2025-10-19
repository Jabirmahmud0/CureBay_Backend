"use strict";
// middleware/devAuth.js
// Development middleware to bypass authentication for testing
console.log('devAuth module loaded');
const User = require('../models/User');
/**
 * Development middleware to create a mock admin user for testing
 * Only used in development environment
 */
async function devAuth(req, res, next) {
    try {
        console.log('devAuth: Middleware called');
        // Check if we're in development mode
        const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        const isLocalTest = req.headers['x-local-test'] === 'true';
        console.log('devAuth: Checking environment');
        console.log('devAuth: NODE_ENV =', process.env.NODE_ENV);
        console.log('devAuth: isDev =', isDev);
        console.log('devAuth: isLocalTest =', isLocalTest);
        // Only apply dev auth in development mode or local testing
        if (!isDev && !isLocalTest) {
            console.log('devAuth: Not in development mode, proceeding to normal auth');
            // Not in development, proceed to normal auth
            return next();
        }
        console.log('devAuth: In development mode, attaching mock user');
        // Check if a specific role is requested for testing
        const testRole = req.headers['x-test-user-role'] || 'admin';
        // In development mode, create or find a mock user with the specified role
        let user = await User.findOne({ email: `${testRole}@example.com` });
        if (!user) {
            user = await User.create({
                name: `${testRole.charAt(0).toUpperCase() + testRole.slice(1)} User`,
                username: testRole,
                email: `${testRole}@example.com`,
                password: 'test123',
                role: testRole,
                profilePicture: null,
                phone: null,
                address: null,
                isActive: true
            });
        }
        else if (user.role !== testRole) {
            // Ensure the user has the correct role
            user.role = testRole;
            await user.save();
        }
        // Attach user to request object
        req.user = user;
        req.firebaseUser = {
            uid: `dev-${testRole}-123`,
            email: `${testRole}@example.com`,
            name: `${testRole.charAt(0).toUpperCase() + testRole.slice(1)} User`
        };
        console.log('devAuth: Attached user:', req.user.email);
        console.log('devAuth: Attached firebaseUser:', req.firebaseUser.email);
        next();
    }
    catch (error) {
        console.error('devAuth: Error:', error);
        // If there's an error in devAuth, proceed to normal auth
        next();
    }
}
module.exports = { devAuth };
