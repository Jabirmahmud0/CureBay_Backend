"use strict";

const admin = require('../utils/firebase');
const User = require('../models/User');

// Example: Verify a Firebase ID token
async function verifyToken(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw error;
  }
}

// Sync Firebase user with MongoDB user
async function syncFirebaseUser(decodedToken) {
  try {
    const email = decodedToken.email;
    const name = decodedToken.name || decodedToken.email.split('@')[0];
    const username = name;
    const profilePicture = decodedToken.picture || null;
    
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
    } else {
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
  } catch (error) {
    throw error;
  }
}

module.exports = { verifyToken, syncFirebaseUser };