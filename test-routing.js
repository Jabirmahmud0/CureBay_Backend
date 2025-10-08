const express = require('express');
const couponRoutes = require('./src/routes/coupons');

const app = express();
const PORT = 3000;

// Test endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'Test endpoint working' });
});

// Test coupon endpoint
app.get('/api/coupons/test', (req, res) => {
    console.log('Test coupon endpoint hit');
    res.json({ message: 'Coupon test endpoint working' });
});

// Register coupons routes
app.use('/api/coupons', couponRoutes);
console.log('Registered /api/coupons routes');

app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});