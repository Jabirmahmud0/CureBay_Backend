"use strict";

const HeroSlide = require('../models/HeroSlide');
const Medicine = require('../models/Medicine');

// Get all active hero slides
async function getHeroSlides(req, res) {
    console.log('getHeroSlides called');
    try {
        const active = req.query.active === 'true' ? true : req.query.active === 'false' ? false : null;
        
        // Build filter object
        let filter = {};
        
        // Filter by active status
        if (active !== null) {
            filter.active = active;
        }
        
        // Get hero slides
        let slides = await HeroSlide.find(filter)
            .populate({
                path: 'featured.medicine',
                populate: [
                    { path: 'category', select: 'name' },
                    { path: 'seller', select: 'name' }
                ]
            })
            .sort({ order: 1, createdAt: -1 });
        
        // Apply date range filtering on active slides
        if (active === true) {
            const now = new Date();
            slides = slides.filter(slide => {
                const startDate = slide.startDate ? new Date(slide.startDate) : null;
                const endDate = slide.endDate ? new Date(slide.endDate) : null;
                
                return (!startDate || now >= startDate) && 
                       (!endDate || now <= endDate);
            });
        }
        
        res.json(slides);
    } catch (err) {
        console.error('Error in getHeroSlides:', err);
        res.status(500).json({ error: err.message });
    }
}

// Get hero slide by ID
async function getHeroSlideById(req, res) {
    console.log('getHeroSlideById called');
    try {
        const slide = await HeroSlide.findById(req.params.id)
            .populate({
                path: 'featured.medicine',
                populate: [
                    { path: 'category', select: 'name' },
                    { path: 'seller', select: 'name' }
                ]
            });
        
        if (!slide) {
            return res.status(404).json({ error: 'Hero slide not found' });
        }
        
        res.json(slide);
    } catch (err) {
        console.error('Error in getHeroSlideById:', err);
        res.status(500).json({ error: err.message });
    }
}

// Create new hero slide (admin only)
async function createHeroSlide(req, res) {
    console.log('createHeroSlide called');
    try {
        // Map priority to order if provided
        const slideData = { ...req.body };
        if (slideData.priority !== undefined) {
            slideData.order = slideData.priority;
            delete slideData.priority;
        }
        
        const slide = new HeroSlide(slideData);
        await slide.save();
        res.status(201).json(slide);
    } catch (err) {
        console.error('Error in createHeroSlide:', err);
        res.status(400).json({ error: err.message });
    }
}

// Update hero slide (admin only)
async function updateHeroSlide(req, res) {
    console.log('updateHeroSlide called');
    try {
        const slide = await HeroSlide.findById(req.params.id);
        
        if (!slide) {
            return res.status(404).json({ error: 'Hero slide not found' });
        }
        
        // Map priority to order if provided
        const updateData = { ...req.body };
        if (updateData.priority !== undefined) {
            updateData.order = updateData.priority;
            delete updateData.priority;
        }
        
        Object.assign(slide, updateData);
        await slide.save();
        
        // Populate references
        await slide.populate({
            path: 'featured.medicine',
            populate: [
                { path: 'category', select: 'name' },
                { path: 'seller', select: 'name' }
            ]
        });
        
        res.json(slide);
    } catch (err) {
        console.error('Error in updateHeroSlide:', err);
        res.status(400).json({ error: err.message });
    }
}

// Delete hero slide (admin only)
async function deleteHeroSlide(req, res) {
    console.log('deleteHeroSlide called');
    try {
        const slide = await HeroSlide.findById(req.params.id);
        
        if (!slide) {
            return res.status(404).json({ error: 'Hero slide not found' });
        }
        
        await HeroSlide.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Hero slide deleted successfully' });
    } catch (err) {
        console.error('Error in deleteHeroSlide:', err);
        res.status(500).json({ error: err.message });
    }
}

// Toggle hero slide active status (admin only)
async function toggleHeroSlideStatus(req, res) {
    console.log('toggleHeroSlideStatus called');
    try {
        const slide = await HeroSlide.findById(req.params.id);
        
        if (!slide) {
            return res.status(404).json({ error: 'Hero slide not found' });
        }
        
        slide.active = !slide.active;
        await slide.save();
        
        // Populate references
        await slide.populate({
            path: 'featured.medicine',
            populate: [
                { path: 'category', select: 'name' },
                { path: 'seller', select: 'name' }
            ]
        });
        
        res.json(slide);
    } catch (err) {
        console.error('Error in toggleHeroSlideStatus:', err);
        res.status(500).json({ error: err.message });
    }
}

// Update hero slide priority (admin only)
async function updateHeroSlidePriority(req, res) {
    console.log('updateHeroSlidePriority called');
    try {
        const slide = await HeroSlide.findById(req.params.id);
        
        if (!slide) {
            return res.status(404).json({ error: 'Hero slide not found' });
        }
        
        // Update order field (priority)
        if (req.body.priority !== undefined) {
            slide.order = req.body.priority;
        }
        
        await slide.save();
        
        // Populate references
        await slide.populate({
            path: 'featured.medicine',
            populate: [
                { path: 'category', select: 'name' },
                { path: 'seller', select: 'name' }
            ]
        });
        
        res.json(slide);
    } catch (err) {
        console.error('Error in updateHeroSlidePriority:', err);
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    getHeroSlides,
    getHeroSlideById,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    toggleHeroSlideStatus,
    updateHeroSlidePriority
};