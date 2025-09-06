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
console.log('Starting server...');
// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Add request logging middleware at the very beginning
console.log('Adding request logging middleware');
const requestLogger = (req, res, next) => {
    console.log('=== MIDDLEWARE EXECUTION START ===');
    console.log(`[REQUEST] ${req.method} ${req.path}`);
    console.log('Request headers:', req.headers);
    console.log('=== MIDDLEWARE EXECUTION END ===');
    next();
};
app.use(requestLogger);
console.log('Request logging middleware added');
// Middleware
console.log('Adding cors middleware');
app.use(cors());
console.log('Cors middleware added');
console.log('Adding express.json middleware');
app.use(express.json());
console.log('Express.json middleware added');
console.log('Adding express.urlencoded middleware');
app.use(express.urlencoded({ extended: true }));
console.log('Express.urlencoded middleware added');
console.log('Adding express.static middleware');
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
console.log('Express.static middleware added');
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
// Test route to check middleware
app.get('/api/middleware-test', (req, res) => {
    console.log('Handling middleware test request');
    res.json({ message: 'Middleware test route working!' });
});
// Add specific test routes to check if the mounting is working
app.get('/api/hero-slides-test', (req, res) => {
    console.log('Test route for hero-slides accessed');
    res.json({ message: 'Hero slides test route working!' });
});
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
// Register hero-slides routes with more specific path
app.use('/api/hero-slides', heroSlideRoutes);
console.log('Registered /api/hero-slides routes with heroSlideRoutes:', !!heroSlideRoutes);
// Register banners routes with more specific path
app.use('/api/banners', bannerRoutes);
console.log('Registered /api/banners routes with bannerRoutes:', !!bannerRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
// Start server
async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
startServer();
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
// 404 handler - this should be the last middleware
app.use((req, res) => {
    console.log(`[404] Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ message: 'Route not found' });
});
