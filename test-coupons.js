// Simple test script to verify coupon functionality
const mongoose = require('mongoose');
const Coupon = require('./src/models/Coupon');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/curebay', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Test coupon creation
const testCoupon = async () => {
  try {
    console.log('Testing coupon creation...');
    
    const coupon = new Coupon({
      code: 'TEST2025',
      discountType: 'percentage',
      discountValue: 20,
      minimumOrderAmount: 50,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      createdBy: '64a8f8e8f8e8f8e8f8e8f8e8' // Mock user ID
    });
    
    await coupon.save();
    console.log('Coupon created successfully:', coupon);
    
    // Test finding the coupon
    const foundCoupon = await Coupon.findOne({ code: 'TEST2025' });
    console.log('Found coupon:', foundCoupon);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
};

testCoupon();