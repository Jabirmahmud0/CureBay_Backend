const express = require('express');
const router = express.Router();
const { 
  getMedicineReviews, 
  addReview, 
  addGeneralReview,
  getFeaturedReviews,
  getReviewStats 
} = require('../controllers/reviewController');
const { syncUser } = require('../middleware/userSync');

// Get featured reviews (for homepage) - no authentication required
router.get('/featured', getFeaturedReviews);

// Apply middleware to sync user for protected routes
router.use(syncUser);

// Add a general review (not tied to specific medicine)
router.post('/general', addGeneralReview);

// Get reviews for a medicine
router.get('/medicine/:medicineId', getMedicineReviews);

// Add a review for a medicine
router.post('/medicine/:medicineId', addReview);

// Get review statistics for a medicine
router.get('/medicine/:medicineId/stats', getReviewStats);

module.exports = router;