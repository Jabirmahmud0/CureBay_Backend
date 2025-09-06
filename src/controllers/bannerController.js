"use strict";

const Banner = require('../models/Banner');

// Get all banners with filtering
async function getBanners(req, res) {
    console.log('getBanners called');
    try {
        const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : null;
        
        // Build filter object
        let filter = {};
        
        // Filter by active status
        if (active !== null) {
            filter.active = active;
        }
        
        // Get banners
        const banners = await Banner.find(filter)
            .sort({ order: 1, createdAt: -1 });
        
        res.json(banners);
    } catch (err) {
        console.error('Error in getBanners:', err);
        res.status(500).json({ error: err.message });
    }
}

// Get banner by ID
async function getBannerById(req, res) {
    console.log('getBannerById called');
    try {
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        
        res.json(banner);
    } catch (err) {
        console.error('Error in getBannerById:', err);
        res.status(500).json({ error: err.message });
    }
}

// Create new banner (admin only)
async function createBanner(req, res) {
    console.log('createBanner called');
    try {
        const banner = new Banner(req.body);
        await banner.save();
        res.status(201).json(banner);
    } catch (err) {
        console.error('Error in createBanner:', err);
        res.status(400).json({ error: err.message });
    }
}

// Update banner (admin only)
async function updateBanner(req, res) {
    console.log('updateBanner called');
    try {
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        
        Object.assign(banner, req.body);
        await banner.save();
        
        res.json(banner);
    } catch (err) {
        console.error('Error in updateBanner:', err);
        res.status(400).json({ error: err.message });
    }
}

// Delete banner (admin only)
async function deleteBanner(req, res) {
    console.log('deleteBanner called');
    try {
        const banner = await Banner.findById(req.params.id);
        
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        
        await Banner.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Banner deleted successfully' });
    } catch (err) {
        console.error('Error in deleteBanner:', err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner
};