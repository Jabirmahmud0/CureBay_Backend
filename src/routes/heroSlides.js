"use strict";

const express = require('express');
const router = express.Router();
const { 
  getHeroSlides, 
  getHeroSlideById, 
  createHeroSlide, 
  updateHeroSlide, 
  deleteHeroSlide 
} = require('../controllers/heroSlideController');
const { syncUser } = require('../middleware/userSync');

// Add a simple test route
router.get('/test', (req, res) => {
  console.log('GET /api/hero-slides/test called');
  return res.json({ message: 'Hero slides test route working!' });
});

// Public routes
router.get('/', (req, res) => {
  console.log('GET /api/hero-slides/ called');
  return getHeroSlides(req, res);
});

router.get('/:id', (req, res) => {
  console.log(`GET /api/hero-slides/${req.params.id} called`);
  return getHeroSlideById(req, res);
});

// Protected routes (require authentication)
router.post('/', syncUser, createHeroSlide);
router.put('/:id', syncUser, updateHeroSlide);
router.delete('/:id', syncUser, deleteHeroSlide);

module.exports = router;