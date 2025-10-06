const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('./src/models/Medicine');
const User = require('./src/models/User');
const Order = require('./src/models/Order');

dotenv.config();

async function testStats() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');
    console.log('Connected to MongoDB');
    
    // Count documents
    const products = await Medicine.countDocuments();
    console.log('Products count:', products);
    
    const customers = await User.countDocuments();
    console.log('Customers count:', customers);
    
    const support = await Order.countDocuments();
    console.log('Support count:', support);
    
    console.log('Stats:', { products, customers, support });
    
    // Close connection
    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error:', error);
  }
}

testStats();