"use strict";
const Category = require('../models/Category');
// Get all categories
async function getCategories(req, res) {
    console.log('getCategories controller called');
    try {
        const categories = await Category.find({ isActive: true }).sort({ name: 1 });
        console.log(`Found ${categories.length} categories`);
        res.json(categories);
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
