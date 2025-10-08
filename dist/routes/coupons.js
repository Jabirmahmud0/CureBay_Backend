"use strict";
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { syncUser } = require('../middleware/userSync');
const { devAuth } = require('../middleware/devAuth');
console.log('Loading coupon routes...');
// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
    // Add detailed logging to understand what's happening
    console.log('requireAdmin middleware called');
    console.log('req.user:', req.user);
    console.log('req.user.role:', req.user ? req.user.role : 'no user');
    if (!req.user) {
        console.log('No user in request - returning 401');
        return res.status(401).json({ error: 'No user authenticated' });
    }
    if (req.user.role !== 'admin') {
        console.log('User is not admin:', req.user.role);
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    console.log('User is admin, proceeding');
    next();
};
// Add logging middleware to see the order of execution
const logRequest = (req, res, next) => {
    console.log('=== Coupon Route Request ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Headers:', req.headers);
    console.log('========================');
    next();
};
// GET /api/coupons - Get all coupons (admin only)
router.get('/', logRequest, devAuth, syncUser, requireAdmin, (req, res) => {
    console.log('GET /api/coupons called');
    console.log('User in request:', req.user);
    return couponController.getCoupons(req, res);
});
// Test route without middleware
router.get('/test-public', (req, res) => {
    console.log('GET /api/coupons/test-public called');
    return res.json({ message: 'Public test route working' });
});
// GET /api/coupons/:id - Get specific coupon (admin only)
router.get('/:id', logRequest, devAuth, syncUser, requireAdmin, (req, res) => {
    console.log('GET /api/coupons/:id called');
    console.log('User in request:', req.user);
    return couponController.getCouponById(req, res);
});
// POST /api/coupons - Create new coupon (admin only)
router.post('/', logRequest, devAuth, syncUser, requireAdmin, (req, res) => {
    console.log('POST /api/coupons called');
    console.log('User in request:', req.user);
    return couponController.createCoupon(req, res);
});
// PUT /api/coupons/:id - Update coupon (admin only)
router.put('/:id', logRequest, devAuth, syncUser, requireAdmin, (req, res) => {
    console.log('PUT /api/coupons/:id called');
    console.log('User in request:', req.user);
    return couponController.updateCoupon(req, res);
});
// DELETE /api/coupons/:id - Delete coupon (admin only)
router.delete('/:id', logRequest, devAuth, syncUser, requireAdmin, (req, res) => {
    console.log('DELETE /api/coupons/:id called');
    console.log('User in request:', req.user);
    return couponController.deleteCoupon(req, res);
});
// POST /api/coupons/validate - Validate coupon (public)
router.post('/validate', (req, res) => {
    console.log('POST /api/coupons/validate called');
    return couponController.validateCoupon(req, res);
});
console.log('Coupon routes loaded successfully');
module.exports = router;
