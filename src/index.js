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
const statsRoutes = require('./routes/stats');
const orderRoutes = require('./routes/orders');
const Medicine = require('./models/Medicine');
const User = require('./models/User');
const Order = require('./models/Order');

console.log('Starting server...');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Simple test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test endpoint working' });
});

// Stats endpoint
app.get('/api/stats', async (req, res) => {
    try {
        // Return fixed values for now to test if endpoint works
        res.json({ products: 300, customers: 1500, support: 30 });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Completely new endpoint to test routing
app.get('/api/stats-new', async (req, res) => {
    try {
        res.json({ products: 300, customers: 1500, support: 30, message: 'New stats endpoint working' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

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

// Add a simple test endpoint at the very beginning to verify routing works
app.get('/api/test-routing', (req, res) => {
    res.json({ message: 'Routing is working' });
});

// Register routes early
// Debug: Log what we're about to register
console.log('About to register stats routes:', typeof statsRoutes);
console.log('Stats routes keys:', Object.keys(statsRoutes || {}));

// Register orders routes
app.use('/api/orders', orderRoutes);
console.log('Registered /api/orders routes');

// Other routes
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
console.log('Registered /api/hero-slides routes');

app.use('/api/banners', bannerRoutes);
console.log('Registered /api/banners routes');

// Root route
app.get('/', (req, res) => {
    console.log('Handling root request');
    res.json({ message: 'CureBay API Server is running!' });
});

// Debug middleware to see what routes are being hit
app.use((req, res, next) => {
    console.log('Debug middleware hit:', req.method, req.path);
    next();
});

// Move 404 handler to the end - this should be the last middleware
app.use((req, res) => {
    console.log(`[404] Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware - should be just before starting server
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
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

module.exports = app;