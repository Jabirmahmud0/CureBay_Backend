const express = require('express');
const app = express();
const port = 3005;

// Simple test route
app.get('/', (req, res) => {
  console.log('Root route hit');
  res.json({ message: 'Root route working' });
});

// Test API route
app.get('/api/test', (req, res) => {
  console.log('API test route hit');
  res.json({ message: 'API test route working' });
});

app.listen(port, () => {
  console.log(`Simple test server running on port ${port}`);
});