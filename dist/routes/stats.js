"use strict";
const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const Order = require('../models/Order');
// GET /api/stats - returns products, customers, support counts
// Handle both /api/stats and /api/stats/ 
router.get('/', async (req, res) => {
    console.log('Stats route accessed via /');
    try {
        const products = await Medicine.countDocuments();
        const customers = await User.countDocuments();
        const support = await Order.countDocuments();
        const statsData = { products, customers, support };
        console.log('Stats data:', JSON.stringify(statsData));
        // Send as JSON directly
        res.status(200).json(statsData);
    }
    catch (err) {
        console.error('Stats route error:', err);
        res.status(500).json({ error: err.message });
    }
});
// Also handle the root path directly to ensure compatibility
router.get('', async (req, res) => {
    console.log('Stats route accessed via empty path');
    try {
        const products = await Medicine.countDocuments();
        const customers = await User.countDocuments();
        const support = await Order.countDocuments();
        const statsData = { products, customers, support };
        console.log('Stats data:', JSON.stringify(statsData));
        // Send as JSON directly
        res.status(200).json(statsData);
    }
    catch (err) {
        console.error('Stats route error:', err);
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;
