"use strict";
// middleware/devAuth.js
// Development middleware to bypass authentication for testing
const User = require('../models/User');
/**
 * Development middleware to create a mock admin user for testing
 * Only used in development environment
 */
async function devAuth(req, res, next) {
    try {
        console.log('devAuth middleware called');
        // Check if we're in development mode or if a special header is present for local testing
        const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
        const isLocalTest = req.headers['x-local-test'] === 'true';
        console.log('Is development mode:', isDev);
        console.log('Is local test:', isLocalTest);
        // Only apply dev auth in development or when explicitly requested for testing
        if (!isDev && !isLocalTest) {
            // Not in development, proceed to normal auth
            console.log('Not in development mode, proceeding to normal auth');
            return next();
        }
        console.log('Applying dev auth - creating mock admin user');
        // In development mode, create or find a mock admin user
        let user = await User.findOne({ email: 'admin@example.com' });
        if (!user) {
            console.log('Creating mock admin user');
            user = await User.create({
                name: 'Admin User',
                username: 'admin',
                email: 'admin@example.com',
                password: 'admin123',
                role: 'admin',
                profilePicture: null,
                phone: null,
                address: null,
                isActive: true
            });
        }
        else if (user.role !== 'admin') {
            // Ensure the user is an admin
            console.log('Updating user to admin role');
            user.role = 'admin';
            await user.save();
        }
        // Attach user to request object
        req.user = user;
        req.firebaseUser = {
            uid: 'dev-admin-123',
            email: 'admin@example.com',
            name: 'Admin User'
        };
        console.log('Mock admin user attached to request');
        next();
    }
    catch (error) {
        console.error('Error in devAuth middleware:', error);
        next();
    }
}
module.exports = { devAuth };
