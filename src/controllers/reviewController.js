const Review = require('../models/Review');
const Medicine = require('../models/Medicine');
const User = require('../models/User');
const Order = require('../models/Order');

// Get all reviews for a medicine
const getMedicineReviews = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ medicine: medicineId })
      .populate('user', 'name role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReviews = await Review.countDocuments({ medicine: medicineId });

    res.json({
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalReviews / limit),
        totalReviews,
        hasNextPage: page < Math.ceil(totalReviews / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error while fetching reviews' });
  }
};

// Add a review for a medicine
const addReview = async (req, res) => {
  try {
    const { medicineId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // Assuming user is authenticated
    const userRole = req.user.role; // Get user role

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    if (comment.length > 500) {
      return res.status(400).json({ message: 'Comment must be less than 500 characters' });
    }

    // Check if medicine exists
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Check if user is authorized to submit reviews
    // Admins and sellers can always submit reviews
    if (userRole === 'admin' || userRole === 'seller') {
      // Authorized users can submit reviews
    } else {
      // For regular users, check if they have purchased this specific medicine
      const userOrders = await Order.find({ 
        user: userId, 
        status: 'delivered',
        'items.medicine': medicineId
      });
      
      // If no delivered orders found for this medicine, user cannot submit review
      if (userOrders.length === 0) {
        return res.status(403).json({ message: 'Only users who have purchased this medicine can review it' });
      }
    }

    // Check if user already reviewed this medicine
    const existingReview = await Review.findOne({ user: userId, medicine: medicineId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this medicine' });
    }

    // Create review
    const review = new Review({
      user: userId,
      medicine: medicineId,
      rating,
      comment,
      isVerifiedPurchase: true // Verified since we checked purchase history
    });

    const savedReview = await review.save();

    // Populate user info
    await savedReview.populate('user', 'name');

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
};

// Add a general review (not tied to a specific medicine)
const addGeneralReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id; // Assuming user is authenticated
    const userRole = req.user.role; // Get user role

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ message: 'Comment is required' });
    }

    if (comment.length > 500) {
      return res.status(400).json({ message: 'Comment must be less than 500 characters' });
    }

    // Check if user is authorized to submit reviews
    // Admins and sellers can always submit reviews
    if (userRole === 'admin' || userRole === 'seller') {
      // Authorized users can submit reviews
    } else {
      // For regular users, check if they have purchased any medicine
      const userOrders = await Order.find({ 
        user: userId, 
        status: 'delivered' 
      });
      
      // If no delivered orders found, user cannot submit review
      if (userOrders.length === 0) {
        return res.status(403).json({ message: 'Only users who have purchased medicine can submit reviews' });
      }
    }

    // For general reviews, we don't tie them to a specific medicine
    const review = new Review({
      user: userId,
      rating,
      comment,
      isVerifiedPurchase: true // Assume verified for general reviews
    });

    const savedReview = await review.save();

    // Populate user info
    await savedReview.populate('user', 'name');

    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error adding general review:', error);
    res.status(500).json({ message: 'Server error while adding review' });
  }
};

// Get featured reviews (latest reviews across all medicines)
const getFeaturedReviews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3;

    const reviews = await Review.find()
      .populate('user', 'name role profilePicture') // Include profilePicture in populated user data
      .populate('medicine', 'name')
      .sort({ rating: -1, createdAt: -1 }) // Sort by rating first, then by creation date
      .limit(limit);

    // Get total review count
    const totalReviews = await Review.countDocuments();

    // Calculate average rating
    const allReviews = await Review.find();
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

    res.json({
      reviews,
      totalReviews,
      averageRating: parseFloat(averageRating.toFixed(1))
    });
  } catch (error) {
    console.error('Error fetching featured reviews:', error);
    res.status(500).json({ message: 'Server error while fetching featured reviews' });
  }
};

// Get review statistics for a medicine
const getReviewStats = async (req, res) => {
  try {
    const { medicineId } = req.params;

    // Check if medicine exists
    const medicine = await Medicine.findById(medicineId);
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Get all reviews for this medicine
    const reviews = await Review.find({ medicine: medicineId });

    if (reviews.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [
          { stars: 5, count: 0, percentage: 0 },
          { stars: 4, count: 0, percentage: 0 },
          { stars: 3, count: 0, percentage: 0 },
          { stars: 2, count: 0, percentage: 0 },
          { stars: 1, count: 0, percentage: 0 }
        ]
      });
    }

    // Calculate statistics
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    // Calculate rating distribution
    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
      const count = reviews.filter(review => review.rating === stars).length;
      const percentage = Math.round((count / reviews.length) * 100);
      return { stars, count, percentage };
    });

    res.json({
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length,
      ratingDistribution
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ message: 'Server error while fetching review stats' });
  }
};

module.exports = {
  getMedicineReviews,
  addReview,
  addGeneralReview,
  getFeaturedReviews,
  getReviewStats
};