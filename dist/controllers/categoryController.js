"use strict";
const Category = require('../models/Category');
// Get all categories
async function getCategories(req, res) {
    console.log('getCategories controller called');
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        console.log(`Found ${categories.length} categories`);
        // Get medicine counts for each category
        const Medicine = require('../models/Medicine');
        console.log('Medicine model loaded:', !!Medicine);
        const categoriesWithCount = await Promise.all(categories.map(async (category) => {
            console.log(`Processing category: ${category.name} with ID: ${category._id}`);
            // Ensure we're using the proper ObjectId for comparison
            const count = await Medicine.countDocuments({
                category: category._id
            });
            console.log(`Count for ${category.name}: ${count}`);
            const categoryObj = category.toObject();
            categoryObj.count = count;
            console.log(`Category object with count:`, categoryObj);
            return categoryObj;
        }));
        console.log('Categories with medicine counts prepared:', categoriesWithCount);
        res.json(categoriesWithCount);
    }
    catch (err) {
        console.error('Error in getCategories:', err);
        res.status(500).json({ error: err.message });
    }
}
// Get category by ID
async function getCategoryById(req, res) {
    console.log(`getCategoryById controller called with id: ${req.params.id}`);
    try {
        // Validate category ID format (basic MongoDB ObjectId check)
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        if (!req.params.id || !objectIdRegex.test(req.params.id)) {
            console.log('Invalid category ID format');
            return res.status(400).json({ error: 'Invalid category ID' });
        }
        const category = await Category.findById(req.params.id);
        if (!category) {
            console.log('Category not found');
            return res.status(404).json({ error: 'Category not found' });
        }
        if (!category.isActive) {
            console.log('Category not available');
            return res.status(404).json({ error: 'Category not available' });
        }
        console.log('Category found:', category.name);
        res.json(category);
    }
    catch (err) {
        console.error('Error in getCategoryById:', err);
        res.status(500).json({ error: err.message });
    }
}
// Create new category (admin only)
async function createCategory(req, res) {
    console.log('createCategory controller called');
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
// Update category (admin only)
async function updateCategory(req, res) {
    console.log('updateCategory controller called');
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}
// Delete category (admin only)
async function deleteCategory(req, res) {
    console.log('deleteCategory controller called');
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports = {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
