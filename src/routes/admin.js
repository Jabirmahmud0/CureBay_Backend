const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Medicine = require('../models/Medicine');
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

// GET /api/admin/overview
router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalMedicines = await Medicine.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Orders as payments
    const orders = await Order.find();
    const totalRevenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.totalAmount, 0);
    const paidTotal = totalRevenue;
    const pendingTotal = orders.filter(o => o.paymentStatus === 'pending').reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      totalUsers,
      totalSellers,
      totalMedicines,
      totalOrders,
      totalRevenue,
      paidTotal,
      pendingTotal
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/recent-users
router.get('/recent-users', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role isActive createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/pending-payments
router.get('/pending-payments', async (req, res) => {
  try {
    // Find all orders with paymentStatus 'pending'
    const orders = await Order.find({ paymentStatus: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    // Map to required fields
    const payments = orders.map(order => ({
      id: order._id,
      amount: order.totalAmount,
      customer: order.user ? (order.user.name || order.user.email) : 'Unknown',
      email: order.user ? order.user.email : '',
      date: order.createdAt,
    }));
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/payments
router.get('/payments', async (req, res) => {
  try {
    // Find all orders and populate user and medicine details
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.medicine')
      .sort({ createdAt: -1 });
    
    // Map orders to payment format expected by frontend
    const payments = orders.map(order => ({
      id: order._id,
      orderId: `ORD-${order._id.toString().substring(0, 8).toUpperCase()}`,
      customerName: order.user ? (order.user.name || order.user.email) : 'Unknown Customer',
      customerEmail: order.user ? order.user.email : '',
      amount: order.totalAmount,
      paymentMethod: 'Credit Card', // Default for now
      status: order.paymentStatus,
      createdAt: order.createdAt,
      acceptedAt: order.paymentStatus === 'paid' ? order.updatedAt : null,
      rejectedAt: order.paymentStatus === 'failed' ? order.updatedAt : null,
      medicines: order.items.map(item => ({
        name: item.medicine ? item.medicine.name : 'Unknown Medicine',
        quantity: item.quantity,
        price: item.price
      })),
      paymentDetails: {
        cardLast4: '1234', // Default for now
        transactionId: `TXN-${order._id.toString().substring(0, 8).toUpperCase()}`
      }
    }));
    
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/accept-payment/:orderId
router.patch('/accept-payment/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.paymentStatus = 'paid';
    await order.save();
    res.json({ message: 'Payment accepted', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/payments/:paymentId/accept
router.patch('/payments/:paymentId/accept', async (req, res) => {
  try {
    const order = await Order.findById(req.params.paymentId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.paymentStatus = 'paid';
    await order.save();
    res.json({ message: 'Payment accepted', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/admin/payments/:paymentId/reject
router.patch('/payments/:paymentId/reject', async (req, res) => {
  try {
    const order = await Order.findById(req.params.paymentId);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.paymentStatus = 'failed';
    await order.save();
    res.json({ message: 'Payment rejected', order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;