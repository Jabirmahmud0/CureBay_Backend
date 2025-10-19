"use strict";

const Medicine = require('../models/Medicine');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get all medicines with filtering and pagination
async function getMedicines(req, res) {
  try {
    console.log('GET /api/medicines called with query params:', req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'desc';
    const inStock = req.query.inStock === 'true' ? true : req.query.inStock === 'false' ? false : null;
    const category = req.query.category || null;
    const search = req.query.search || null;
    const sellerId = req.query.sellerId || null; // Add sellerId filter support
    console.log('Parsed parameters - page:', page, 'limit:', limit, 'sellerId:', sellerId);
    
    // Build filter object
    let filter = {};
    
    // Filter by stock status
    if (inStock !== null) {
      filter.inStock = inStock;
    }
    
    // Filter by category - validate that it's a valid MongoDB ObjectId
    if (category) {
      // Validate category ID format (basic MongoDB ObjectId check)
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (objectIdRegex.test(category)) {
        filter.category = category;
      } else {
        // If category is not a valid ObjectId, return empty results
        return res.json({
          medicines: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0
          }
        });
      }
    }
    
    // Filter by sellerId - validate that it's a valid MongoDB ObjectId
    if (sellerId) {
      console.log('Processing sellerId filter:', sellerId);
      // Validate seller ID format (basic MongoDB ObjectId check)
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (objectIdRegex.test(sellerId)) {
        // Convert string to ObjectId for proper querying
        filter.seller = new mongoose.Types.ObjectId(sellerId);
        console.log('Applied seller filter:', filter.seller);
      } else {
        console.log('Invalid sellerId format, returning empty results');
        // If sellerId is not a valid ObjectId, return empty results
        return res.json({
          medicines: [],
          pagination: {
            page,
            limit,
            total: 0,
            pages: 0
          }
        });
      }
    }
    
    // Filter by search term
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { genericName: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort object
    let sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    console.log('Applying filter:', filter);
    // Get medicines
    const medicines = await Medicine.find(filter)
      .populate('category', 'name')
      .populate('seller', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Medicine.countDocuments(filter);
    console.log('Found', medicines.length, 'medicines out of', total, 'total');
    
    res.json({
      medicines,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get medicine by ID
async function getMedicineById(req, res) {
  try {
    const medicine = await Medicine.findById(req.params.id)
      .populate('category', 'name')
      .populate('seller', 'name');
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get discounted medicines
async function getDiscountedMedicines(req, res) {
    try {
        // Set a reasonable default and maximum limit
        const defaultLimit = 12;
        const maxLimit = 100;
        let limit = parseInt(req.query.limit) || defaultLimit;
        
        // If no limit is specified or limit is 0, set to max limit
        if (!req.query.limit || limit === 0) {
            limit = maxLimit;
        }
        
        // Ensure limit doesn't exceed maximum
        if (limit > maxLimit) {
            limit = maxLimit;
        }
        
        // Get current date for time-based discount validation
        const currentDate = new Date();
        
        // Get medicines with discount greater than 0
        // Also ensure we only get medicines that are in stock
        // And discount is currently active (within start and end dates if specified)
        const medicines = await Medicine.find({ 
            discountPercentage: { $gt: 0 },
            inStock: true,
            $or: [
                { discountStartDate: null },
                { discountStartDate: { $lte: currentDate } }
            ],
            $or: [
                { discountEndDate: null },
                { discountEndDate: { $gte: currentDate } }
            ]
        })
          .populate('category', 'name')
          .populate('seller', 'name')
          .sort({ discountPercentage: -1, createdAt: -1 })
          .limit(limit);
        
        res.json({
            medicines
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Create new medicine (seller/admin only)
async function createMedicine(req, res) {
  try {
    // Check if user is admin and a sellerId is provided in the request body
    let sellerId = req.user._id; // Default to current user
    
    if (req.user.role === 'admin' && req.body.seller) {
      // Validate that the provided seller ID is a valid MongoDB ObjectId
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (objectIdRegex.test(req.body.seller)) {
        sellerId = req.body.seller;
      } else {
        return res.status(400).json({ error: 'Invalid seller ID format' });
      }
    }
    
    const medicine = new Medicine({
      ...req.body,
      seller: sellerId
    });
    
    await medicine.save();
    
    // Populate references
    await medicine.populate('category', 'name');
    await medicine.populate('seller', 'name');
    
    res.status(201).json(medicine);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Update medicine (seller/admin only)
async function updateMedicine(req, res) {
    try {
        const medicine = await Medicine.findById(req.params.id);
        
        if (!medicine) {
            return res.status(404).json({ error: 'Medicine not found' });
        }
        
        // Check if user is authorized to update this medicine
        if (req.user.role !== 'admin' && medicine.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to update this medicine' });
        }
        
        // Handle discount date validation
        if (req.body.discountStartDate && req.body.discountEndDate) {
            const startDate = new Date(req.body.discountStartDate);
            const endDate = new Date(req.body.discountEndDate);
            
            if (startDate > endDate) {
                return res.status(400).json({ error: 'Discount start date must be before end date' });
            }
        }
        
        // Create a copy of the request body and remove sensitive fields that shouldn't be updated
        const updateData = { ...req.body };
        delete updateData.seller; // Seller should not be changeable
        delete updateData._id; // ID should not be changeable
        
        Object.assign(medicine, updateData);
        await medicine.save();
        
        // Populate references
        await medicine.populate('category', 'name');
        await medicine.populate('seller', 'name');
        
        res.json(medicine);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Delete medicine (seller/admin only)
async function deleteMedicine(req, res) {
  try {
    const medicine = await Medicine.findById(req.params.id);
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    // Check if user is authorized to delete this medicine
    if (req.user.role !== 'admin' && medicine.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this medicine' });
    }
    
    await Medicine.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
    getMedicines,
    getMedicineById,
    getDiscountedMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine
};