"use strict";
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const medicineRoutes = require('./routes/medicines');
const categoryRoutes = require('./routes/categories');
const heroSlideRoutes = require('./routes/heroSlides');
const bannerRoutes = require('./routes/banners');
const orderRoutes = require('./routes/orders');
const couponRoutes = require('./routes/coupons');
const paymentRoutes = require('./routes/payments');
const reviewsRoutes = require('./routes/reviews');
const statsRoutes = require('./routes/stats');
const { devAuth } = require('./middleware/devAuth');
const Medicine = require('./models/Medicine');
const User = require('./models/User');
const Order = require('./models/Order');
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Apply devAuth middleware only in development mode
console.log('Checking NODE_ENV:', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    console.log('Applying devAuth middleware');
    app.use(devAuth);
}
else {
    console.log('Not applying devAuth middleware, NODE_ENV:', process.env.NODE_ENV);
}
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/stats', statsRoutes);
// Root route
app.get('/', (req, res) => {
    res.json({ message: 'CureBay API Server is running!' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Database connection
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');
        console.log('MongoDB connected successfully');
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
// Start server
async function startServer() {
    await connectDB();
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
}
startServer();
module.exports = app;
