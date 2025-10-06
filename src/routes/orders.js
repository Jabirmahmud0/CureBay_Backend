const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
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

// Apply admin check to all routes
router.use(requireAdmin);

// GET /api/orders - Get all orders (admin only)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.medicine', 'name price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id - Get specific order (admin only)
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.medicine', 'name price');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    console.error('Error fetching order:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;