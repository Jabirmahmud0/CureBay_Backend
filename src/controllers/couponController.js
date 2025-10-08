"use strict";

const Coupon = require('../models/Coupon');
const User = require('../models/User');

// Generate a random coupon code
const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
};

// Get all coupons
async function getCoupons(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const coupons = await Coupon.find()
            .populate('applicableCategories', 'name')
            .populate('applicableMedicines', 'name')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
            
        const total = await Coupon.countDocuments();
        
        res.json({
            coupons,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        console.error('Error in getCoupons:', err);
        res.status(500).json({ error: err.message });
    }
}

// Get coupon by ID
async function getCouponById(req, res) {
    try {
        const coupon = await Coupon.findById(req.params.id)
            .populate('applicableCategories', 'name')
            .populate('applicableMedicines', 'name')
            .populate('createdBy', 'name email');
            
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        
        res.json(coupon);
    } catch (err) {
        console.error('Error in getCouponById:', err);
        res.status(500).json({ error: err.message });
    }
}

// Create new coupon
async function createCoupon(req, res) {
    try {
        // Generate unique coupon code
        let code = req.body.code || generateCouponCode();
        let isUnique = false;
        let attempts = 0;
        
        // Ensure code uniqueness
        while (!isUnique && attempts < 5) {
            const existingCoupon = await Coupon.findOne({ code });
            if (existingCoupon) {
                code = generateCouponCode();
                attempts++;
            } else {
                isUnique = true;
            }
        }
        
        if (!isUnique) {
            return res.status(400).json({ error: 'Unable to generate unique coupon code' });
        }
        
        const coupon = new Coupon({
            ...req.body,
            code,
            createdBy: req.user._id
        });
        
        // Validate dates
        if (coupon.startDate >= coupon.endDate) {
            return res.status(400).json({ error: 'End date must be after start date' });
        }
        
        await coupon.save();
        
        // Populate references
        await coupon.populate('applicableCategories', 'name');
        await coupon.populate('applicableMedicines', 'name');
        await coupon.populate('createdBy', 'name email');
        
        res.status(201).json(coupon);
    } catch (err) {
        console.error('Error in createCoupon:', err);
        res.status(400).json({ error: err.message });
    }
}

// Update coupon
async function updateCoupon(req, res) {
    try {
        const coupon = await Coupon.findById(req.params.id);
        
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        
        // Prevent updating the code
        if (req.body.code && req.body.code !== coupon.code) {
            return res.status(400).json({ error: 'Coupon code cannot be changed' });
        }
        
        // Validate dates if provided
        if (req.body.startDate && req.body.endDate) {
            const startDate = new Date(req.body.startDate);
            const endDate = new Date(req.body.endDate);
            if (startDate >= endDate) {
                return res.status(400).json({ error: 'End date must be after start date' });
            }
        }
        
        Object.assign(coupon, req.body);
        await coupon.save();
        
        // Populate references
        await coupon.populate('applicableCategories', 'name');
        await coupon.populate('applicableMedicines', 'name');
        await coupon.populate('createdBy', 'name email');
        
        res.json(coupon);
    } catch (err) {
        console.error('Error in updateCoupon:', err);
        res.status(400).json({ error: err.message });
    }
}

// Delete coupon
async function deleteCoupon(req, res) {
    try {
        const coupon = await Coupon.findById(req.params.id);
        
        if (!coupon) {
            return res.status(404).json({ error: 'Coupon not found' });
        }
        
        await Coupon.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Coupon deleted successfully' });
    } catch (err) {
        console.error('Error in deleteCoupon:', err);
        res.status(500).json({ error: err.message });
    }
}

// Validate coupon
async function validateCoupon(req, res) {
    try {
        const { code, orderAmount } = req.body;
        
        if (!code) {
            return res.status(400).json({ error: 'Coupon code is required' });
        }
        
        const coupon = await Coupon.findOne({ 
            code: code.toUpperCase(),
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        });
        
        if (!coupon) {
            return res.status(404).json({ error: 'Invalid or expired coupon' });
        }
        
        // Check usage limit
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ error: 'Coupon usage limit exceeded' });
        }
        
        // Check minimum order amount
        if (orderAmount && coupon.minimumOrderAmount && orderAmount < coupon.minimumOrderAmount) {
            return res.status(400).json({ 
                error: `Minimum order amount is $${coupon.minimumOrderAmount}` 
            });
        }
        
        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (orderAmount || 0) * (coupon.discountValue / 100);
            if (coupon.maximumDiscountAmount && discountAmount > coupon.maximumDiscountAmount) {
                discountAmount = coupon.maximumDiscountAmount;
            }
        } else {
            discountAmount = coupon.discountValue;
        }
        
        res.json({
            coupon,
            discountAmount: parseFloat(discountAmount.toFixed(2))
        });
    } catch (err) {
        console.error('Error in validateCoupon:', err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getCoupons,
    getCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon
};