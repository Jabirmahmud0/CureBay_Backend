const express = require('express');
const app = express();
const statsRoutes = require('./src/routes/stats');

// Add logging middleware
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

// Register stats routes
app.use('/api/stats', statsRoutes);

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route not found' });
});

app.listen(3001, () => {
  console.log('Debug server running on port 3001');
});