const express = require('express');
const router = express.Router();
const { getSellerPayments, getAllPayments, createPaymentIntent, confirmPayment } = require('../controllers/paymentController');
const { requireSellerOrAdmin } = require('../middleware/sellerAuth');

// Apply seller auth middleware to all routes in this file
router.use(requireSellerOrAdmin);

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

// POST /api/payments/create-payment-intent - Create a Stripe payment intent
router.post('/create-payment-intent', createPaymentIntent);

// POST /api/payments/confirm - Confirm a payment
router.post('/confirm', confirmPayment);

// GET /api/payments - Get all payments (admin only)
router.get('/', requireAdmin, getAllPayments);

// GET /api/payments/seller/:sellerId - Get payments for a specific seller
router.get('/seller/:sellerId', getSellerPayments);

module.exports = router;