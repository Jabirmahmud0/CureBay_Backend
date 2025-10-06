const express = require('express');
const app = express();

// Import routes
const orderRoutes = require('./src/routes/orders');

// Register middleware to log all routes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Register the orders route
app.use('/api/orders', orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(3001, () => {
  console.log('Debug server running on port 3001');
});
