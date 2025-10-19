"use strict";
const express = require('express');
const router = express.Router();
const { getCategories, getCategoryById, getCategoryByName, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { requireAdmin } = require('../middleware/adminAuth');
// GET /api/categories - get all categories (public)
router.get('/', (req, res) => {
    return getCategories(req, res);
});
// GET /api/categories/:id - get category by ID (public)
router.get('/:id', (req, res) => {
    return getCategoryById(req, res);
});
// GET /api/categories/name/:name - get category by name (public)
router.get('/name/:name', (req, res) => {
    return getCategoryByName(req, res);
});
// Admin protected routes
router.post('/', requireAdmin, createCategory);
router.put('/:id', requireAdmin, updateCategory);
router.delete('/:id', requireAdmin, deleteCategory);
module.exports = router;
