"use strict";
const express = require('express');
const router = express.Router();
const { getBanners, getBannerById, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');
const { syncUser } = require('../middleware/userSync');
// Public routes
router.get('/', (req, res) => {
    console.log('GET /api/banners called');
    return getBanners(req, res);
});
router.get('/:id', (req, res) => {
    console.log(`GET /api/banners/${req.params.id} called`);
    return getBannerById(req, res);
});
// Protected routes (require authentication)
router.post('/', syncUser, createBanner);
router.put('/:id', syncUser, updateBanner);
router.delete('/:id', syncUser, deleteBanner);
module.exports = router;
