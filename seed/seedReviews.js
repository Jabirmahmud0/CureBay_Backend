const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Review = require('../src/models/Review');
const Medicine = require('../src/models/Medicine');
const User = require('../src/models/User');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');

// Sample review comments
const reviewComments = [
  "This medicine has been a game-changer for my condition. Highly effective with minimal side effects.",
  "Great quality and fast delivery. The packaging was secure and the product arrived in perfect condition.",
  "I've been using this for a few weeks now and I'm seeing significant improvement. Would recommend!",
  "Excellent service from CureBay. The medicine is exactly as described and works perfectly.",
  "Fast shipping and genuine product. Will definitely order again from this trusted pharmacy.",
  "The dosage instructions were clear and the medicine has helped me feel much better.",
  "I appreciate the detailed information provided about this medicine. Very informative and helpful.",
  "Great value for money. The quality is excellent and the price is very reasonable.",
  "Professional service and quick delivery. The medicine has made a noticeable difference.",
  "I'm impressed with the quality and effectiveness of this product. Highly satisfied with my purchase.",
  "The medicine arrived quickly and is exactly what I needed. Thank you CureBay!",
  "Excellent customer service and genuine pharmaceutical products. Highly recommended!",
  "This has become my go-to medicine for this condition. Works better than other brands I've tried.",
  "Reliable pharmacy with quality products. The medicine has helped me manage my symptoms effectively.",
  "Great experience overall. The medicine is effective and the delivery was prompt."
];

// Generate exactly 20 reviews
async function seedReviews() {
  try {
    // Clear existing reviews
    await Review.deleteMany({});
    console.log('Existing reviews cleared');
    
    // Get all medicines and users
    const medicines = await Medicine.find({});
    const users = await User.find({});
    
    if (medicines.length === 0 || users.length === 0) {
      console.error('No medicines or users found. Please run seedMedicines.js and seedUsers.js first.');
      process.exit(1);
    }
    
    console.log(`Found ${medicines.length} medicines and ${users.length} users`);
    
    // Generate exactly 20 reviews
    let totalReviews = 0;
    const maxReviews = 20;
    
    // Create 20 reviews
    while (totalReviews < maxReviews) {
      // Random medicine
      const randomMedicine = medicines[Math.floor(Math.random() * medicines.length)];
      
      // Random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      // Random rating (1-5)
      const rating = Math.floor(Math.random() * 5) + 1;
      
      // Random comment
      const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
      
      // Random verification status (80% verified)
      const isVerifiedPurchase = Math.random() > 0.2;
      
      // Create review
      const review = new Review({
        user: randomUser._id,
        medicine: randomMedicine._id,
        rating: rating,
        comment: comment,
        isVerifiedPurchase: isVerifiedPurchase
      });
      
      await review.save();
      totalReviews++;
    }
    
    console.log(`Created ${totalReviews} reviews`);
    console.log('Review seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding reviews:', error);
    process.exit(1);
  }
}

seedReviews();