"use strict";
const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, getCategoryByName, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { requireAdmin } = require('../middleware/adminAuth');
console.log('Categories routes loaded');
// GET /api/categories - get all categories (public)
router.get('/', (req, res) => {
    console.log('GET /api/categories called');
    return getCategories(req, res);
});
// GET /api/categories/:id - get category by ID (public)
router.get('/:id', (req, res) => {
    console.log(`GET /api/categories/${req.params.id} called`);
    return getCategoryById(req, res);
});
// GET /api/categories/name/:name - get category by name (public)
router.get('/name/:name', (req, res) => {
    console.log(`GET /api/categories/name/${req.params.name} called`);
    return getCategoryByName(req, res);
});
// Admin protected routes
router.post('/', requireAdmin, createCategory);
router.put('/:id', requireAdmin, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);
module.exports = router;
