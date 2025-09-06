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
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Add request logging middleware after middleware but before routes
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    next();
});
// Routes
app.get('/', (req, res) => {
    console.log('Handling root request');
    res.json({ message: 'CureBay API Server is running!' });
});
// Test route
app.get('/api/test', (req, res) => {
    console.log('Handling test request');
    res.json({ message: 'Test route working!' });
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
// Log when routes are registered
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
console.log('Registered /api/auth routes');
app.use('/api/users', userRoutes);
console.log('Registered /api/users routes');
app.use('/api/admin', adminRoutes);
console.log('Registered /api/admin routes');
app.use('/api/medicines', medicineRoutes);
console.log('Registered /api/medicines routes');
app.use('/api/categories', categoryRoutes);
console.log('Registered /api/categories routes');
app.use('/api/hero-slides', heroSlideRoutes);
console.log('Registered /api/hero-slides routes with heroSlideRoutes:', !!heroSlideRoutes);
app.use('/api/banners', bannerRoutes);
console.log('Registered /api/banners routes with bannerRoutes:', !!bannerRoutes);
// Add a test route to check if the route registration is working
app.get('/api/hero-slides/test', (req, res) => {
    console.log('Test route for hero-slides accessed');
    res.json({ message: 'Hero slides test route working!' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
// 404 handler
app.use((req, res) => {
    console.log(`[404] Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ message: 'Route not found' });
});
// Start server
async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
startServer();
