const express = require('express');

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

app.listen(PORT, () => {
    console.log(`Minimal test server running on port ${PORT}`);
});