const express = require('express');
const router = express.Router();
const { createOrder, getOrders, getOrderById } = require('../controllers/orderController');
const { syncUser } = require('../middleware/userSync');

// Apply sync middleware to all routes in this file to ensure authentication
router.use(syncUser);

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

// POST /api/orders - Create a new order (public, but requires authentication)
router.post('/', createOrder);

// GET /api/orders - Get all orders (admin only)
router.get('/', requireAdmin, getOrders);

// GET /api/orders/:id - Get specific order (admin only)
router.get('/:id', requireAdmin, getOrderById);

module.exports = router;