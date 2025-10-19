"use strict";

const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { syncUser } = require('../middleware/userSync');
const { devAuth } = require('../middleware/devAuth');

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No user authenticated' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  
  next();
};

// GET /api/coupons - Get all coupons (admin only)
router.get('/', devAuth, syncUser, requireAdmin, (req, res) => {
  return couponController.getCoupons(req, res);
});

// GET /api/coupons/:id - Get specific coupon (admin only)
router.get('/:id', devAuth, syncUser, requireAdmin, (req, res) => {
  return couponController.getCouponById(req, res);
});

// POST /api/coupons - Create new coupon (admin only)
router.post('/', devAuth, syncUser, requireAdmin, (req, res) => {
  return couponController.createCoupon(req, res);
});

// PUT /api/coupons/:id - Update coupon (admin only)
router.put('/:id', devAuth, syncUser, requireAdmin, (req, res) => {
  return couponController.updateCoupon(req, res);
});

// DELETE /api/coupons/:id - Delete coupon (admin only)
router.delete('/:id', devAuth, syncUser, requireAdmin, (req, res) => {
  return couponController.deleteCoupon(req, res);
});

// POST /api/coupons/validate - Validate coupon (public)
router.post('/validate', (req, res) => {
  return couponController.validateCoupon(req, res);
});

// POST /api/coupons/apply - Apply coupon (increment usage count)
router.post('/apply', (req, res) => {
  return couponController.applyCoupon(req, res);
});

module.exports = router;