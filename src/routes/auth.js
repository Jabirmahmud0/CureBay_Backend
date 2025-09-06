"use strict";

const express = require('express');
const router = express.Router();
const { verifyToken, syncFirebaseUser } = require('../controllers/authController');
const User = require('../models/User');
const UserSyncService = require('../services/userSyncService');


// POST /api/auth/firebase-login
router.post('/firebase-login', async (req, res) => {
  console.log('Received request to /api/auth/firebase-login');
  const { idToken } = req.body;
  console.log('ID Token received:', idToken ? 'Present' : 'Missing');
  
  if (!idToken) {
    console.log('No ID token provided in request');
    return res.status(400).json({ error: 'No ID token provided' });
  }
  
  try {
    console.log('Attempting to verify Firebase ID token');
    // Verify Firebase ID token
    const decoded = await verifyToken(idToken);
    console.log('Firebase ID token verified successfully');
    
    // Sync Firebase user with MongoDB using the service
    console.log('Attempting to sync Firebase user with MongoDB');
    const user = await UserSyncService.syncUser(decoded);
    console.log('User synced successfully:', user ? user.email : 'No user');
    
    // Validate user session
    console.log('Validating user session');
    const validationResult = UserSyncService.validateUserSession(user);
    if (!validationResult.isValid) {
      console.log('User session validation failed:', validationResult.reason);
      return res.status(401).json({ error: validationResult.reason });
    }
    
    console.log('Login successful for user:', user.email);
    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
        isActive: user.isActive
      }
    });
  } catch (err) {
    console.error('Error in /api/auth/firebase-login:', err); // Log the error for debugging
    console.error('Error name:', err.name);
    console.error('Error code:', err.code);
    console.error('Error stack:', err.stack);
    res.status(401).json({ error: 'Invalid or expired token', details: err.message });
  }
});

module.exports = router;