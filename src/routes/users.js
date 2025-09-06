"use strict";

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../controllers/authController');
const { syncUser } = require('../middleware/userSync');

// Apply sync middleware to all routes in this file
router.use(syncUser);

// GET /api/users - get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/me - get current user profile (now using middleware)
router.get('/me', async (req, res) => {
  try {
    // User is already synced and attached to req by middleware
    const user = req.user;
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role || 'user',
      profilePicture: user.profilePicture,
      isActive: user.isActive
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id/role - update user role (admin only)
router.patch('/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id - delete a user
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id/active - toggle isActive status
router.patch('/:id/active', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: 'User status updated', isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;