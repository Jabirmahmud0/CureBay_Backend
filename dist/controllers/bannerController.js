"use strict";
const Banner = require('../models/Banner');
// Get all banners with filtering
async function getBanners(req, res) {
    try {
        const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : null;
        // Build filter object
        let filter = {};
        // Filter by active status
        if (active !== null) {
            filter.active = active;
        }
        // Get banners
        let banners = await Banner.find(filter)
            .sort({ order: 1, createdAt: -1 });
        // Apply date range filtering on active banners
        if (active === true) {
            const now = new Date();
            banners = banners.filter(banner => {
                const startDate = banner.startDate ? new Date(banner.startDate) : null;
                const endDate = banner.endDate ? new Date(banner.endDate) : null;
                return (!startDate || now >= startDate) &&
                    (!endDate || now <= endDate);
            });
        }
        res.json(banners);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Get banner by ID
async function getBannerById(req, res) {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        res.json(banner);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Create new banner (admin only)
async function createBanner(req, res) {
    try {
        // Map priority to order if provided
        const bannerData = { ...req.body };
        if (bannerData.priority !== undefined) {
            bannerData.order = bannerData.priority;
            delete bannerData.priority;
        }
        const banner = new Banner(bannerData);
        await banner.save();
        res.status(201).json(banner);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
// Update banner (admin only)
async function updateBanner(req, res) {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        // Map priority to order if provided
        const updateData = { ...req.body };
        if (updateData.priority !== undefined) {
            updateData.order = updateData.priority;
            delete updateData.priority;
        }
        Object.assign(banner, updateData);
        await banner.save();
        res.json(banner);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
// Delete banner (admin only)
async function deleteBanner(req, res) {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Banner deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Toggle banner active status (admin only)
async function toggleBannerStatus(req, res) {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        banner.active = !banner.active;
        await banner.save();
        res.json(banner);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Update banner priority (admin only)
async function updateBannerPriority(req, res) {
    try {
        const banner = await Banner.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: 'Banner not found' });
        }
        // Update order field (priority)
        if (req.body.priority !== undefined) {
            banner.order = req.body.priority;
        }
        await banner.save();
        res.json(banner);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
module.exports = {
    getBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
    updateBannerPriority
};
