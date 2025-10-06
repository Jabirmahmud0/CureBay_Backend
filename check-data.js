const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Models
const Medicine = require('./src/models/Medicine');
const User = require('./src/models/User');
const Order = require('./src/models/Order');

async function checkData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');
    console.log('Connected to MongoDB');

    // Check medicine count
    const medicineCount = await Medicine.countDocuments();
    console.log('Medicine count:', medicineCount);

    // Check user count
    const userCount = await User.countDocuments();
    console.log('User count:', userCount);

    // Check order count
    const orderCount = await Order.countDocuments();
    console.log('Order count:', orderCount);

    // Close connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error:', err);
  }
}

checkData();