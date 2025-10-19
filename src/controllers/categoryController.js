"use strict";

const Category = require('../models/Category');

// Get all categories
async function getCategories(req, res) {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    
    // Get medicine counts for each category
    const Medicine = require('../models/Medicine');
    
    const categoriesWithCount = await Promise.all(categories.map(async (category) => {
      // Ensure we're using the proper ObjectId for comparison
      const count = await Medicine.countDocuments({ 
        category: category._id 
      });
      const categoryObj = category.toObject();
      categoryObj.medicineCount = count; // Use medicineCount instead of count
      return categoryObj;
    }));
    
    res.json(categoriesWithCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get category by ID
async function getCategoryById(req, res) {
  try {
    // Validate category ID format (basic MongoDB ObjectId check)
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    if (!req.params.id || !objectIdRegex.test(req.params.id)) {
      return res.status(400).json({ error: 'Invalid category ID' });
    }
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    if (!category.isActive) {
      return res.status(404).json({ error: 'Category not available' });
    }
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Get category by name
async function getCategoryByName(req, res) {
  try {
    // Decode the category name in case it was encoded
    const categoryName = decodeURIComponent(req.params.name);
    
    // Use case-insensitive search for category name
    const category = await Category.findOne({ 
      name: { $regex: new RegExp(`^${categoryName}$`, 'i') },
      isActive: true 
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Get medicine count for this category
    const Medicine = require('../models/Medicine');
    const count = await Medicine.countDocuments({ 
      category: category._id 
    });
    
    const categoryObj = category.toObject();
    categoryObj.medicineCount = count; // Use medicineCount instead of count
    
    res.json(categoryObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create new category (admin only)
async function createCategory(req, res) {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Update category (admin only)
async function updateCategory(req, res) {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// Delete category (admin only)
async function deleteCategory(req, res) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory
};