const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Add CORS middleware
app.use(cors());

app.get('/api/stats', (req, res) => {
  console.log('Test route accessed');
  const statsData = { products: 300, customers: 1, support: 5 };
  console.log('Preparing response:', JSON.stringify(statsData));
  
  // Create JSON string manually
  const jsonResponse = JSON.stringify(statsData);
  console.log('JSON response:', jsonResponse);
  
  // Set headers explicitly
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', Buffer.byteLength(jsonResponse));
  
  // Send response
  res.status(200).send(jsonResponse);
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});