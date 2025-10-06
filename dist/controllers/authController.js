"use strict";
const admin = require('../utils/firebase');
const User = require('../models/User');
// Utility function to sanitize email
const sanitizeEmail = (email) => {
    if (typeof email !== 'string')
        return '';
    // Basic email sanitization
    return email.trim().toLowerCase();
};
// Utility function to sanitize name
const sanitizeName = (name) => {
    if (typeof name !== 'string')
        return '';
    // Basic name sanitization
    return name.trim();
};
// Example: Verify a Firebase ID token
async function verifyToken(idToken, userData = null) {
    try {
        console.log('Attempting to verify token with Firebase Admin SDK');
        console.log('Firebase apps count:', admin.apps.length);
        if (admin.apps.length > 0) {
            console.log('Default app name:', admin.app().name);
            console.log('Is development mode:', admin.isDevelopmentMode());
        }
        // Validate input
        if (!idToken || typeof idToken !== 'string') {
            throw new Error('Invalid token provided');
        }
        // Check if we're in development mode and should use mock verification
        if (admin.isDevelopmentMode && admin.isDevelopmentMode()) {
            console.log('In development mode - using provided user data or mock token verification');
            // In development mode, use the user data sent from frontend if available
            if (userData && userData.email) {
                const sanitizedEmail = sanitizeEmail(userData.email);
                if (!sanitizedEmail) {
                    throw new Error('Invalid email in user data');
                }
                return {
                    uid: userData.uid || 'dev-user-' + Date.now(),
                    email: sanitizedEmail,
                    name: userData.name ? sanitizeName(userData.name) : sanitizedEmail.split('@')[0],
                    picture: userData.profilePicture || null
                };
            }
            // Fallback to mock data if no user data provided
            return {
                uid: 'dev-user-' + Date.now(),
                email: 'dev@example.com',
                name: 'Development User',
                picture: null
            };
        }
        // In production mode, verify the actual token
        try {
            // Check if auth is available
            const auth = admin.auth();
            console.log('Firebase Auth instance obtained:', !!auth);
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            console.log('Token verified successfully');
            // Validate decoded token data
            if (!decodedToken || !decodedToken.email) {
                throw new Error('Invalid token data');
            }
            // Sanitize email and name
            const sanitizedEmail = sanitizeEmail(decodedToken.email);
            if (!sanitizedEmail) {
                throw new Error('Invalid email in token');
            }
            decodedToken.email = sanitizedEmail;
            if (decodedToken.name) {
                decodedToken.name = sanitizeName(decodedToken.name);
            }
            return decodedToken;
        }
        catch (verificationError) {
            console.log('Token verification failed:', verificationError.message);
            throw verificationError;
        }
    }
    catch (error) {
        console.error('Error verifying token:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        throw new Error('Invalid or expired token');
    }
}
// Sync Firebase user with MongoDB user
async function syncFirebaseUser(decodedToken) {
    try {
        // Validate decoded token
        if (!decodedToken || !decodedToken.email) {
            throw new Error('Invalid token data');
        }
        const email = sanitizeEmail(decodedToken.email);
        const name = decodedToken.name ? sanitizeName(decodedToken.name) : email.split('@')[0];
        const username = name;
        const profilePicture = decodedToken.picture || null;
        // Validate email
        if (!email) {
            throw new Error('Invalid email');
        }
        // Find or create user in MongoDB
        let user = await User.findOne({ email });
        if (!user) {
            // Create new user
            user = await User.create({
                name,
                username,
                email,
                password: 'firebase-auth', // Placeholder, not used with Firebase auth
                role: 'user',
                profilePicture,
                isActive: true
            });
        }
        else {
            // Update existing user with latest Firebase data
            const updateFields = {};
            let needsUpdate = false;
            // Update fields if they're missing or different
            if (user.name !== name) {
                updateFields.name = name;
                needsUpdate = true;
            }
            if (user.username !== username) {
                updateFields.username = username;
                needsUpdate = true;
            }
            if (user.profilePicture !== profilePicture) {
                updateFields.profilePicture = profilePicture;
                needsUpdate = true;
            }
            if (needsUpdate) {
                await User.updateOne({ _id: user._id }, { $set: updateFields });
                user = await User.findById(user._id); // Refresh user data
            }
        }
        return user;
    }
    catch (error) {
        console.error('Error syncing user:', error);
        throw new Error('Failed to sync user data');
    }
}
module.exports = { verifyToken, syncFirebaseUser };
