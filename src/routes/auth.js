"use strict";

const express = require('express');
const router = express.Router();
const { verifyToken, syncFirebaseUser } = require('../controllers/authController');
const User = require('../models/User');
const UserSyncService = require('../services/userSyncService');


// POST /api/auth/firebase-login
router.post('/firebase-login', async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) return res.status(400).json({ error: 'No ID token provided' });
  try {
    // Verify Firebase ID token
    const decoded = await verifyToken(idToken);
    
    // Sync Firebase user with MongoDB using the service
    const user = await UserSyncService.syncUser(decoded);
    
    // Validate user session
    const validationResult = UserSyncService.validateUserSession(user);
    if (!validationResult.isValid) {
      return res.status(401).json({ error: validationResult.reason });
    }
    
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
    console.error(err); // Log the error for debugging
    res.status(401).json({ error: 'Invalid or expired token', details: err.message });
  }
});

module.exports = router;