const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Order = require('../src/models/Order');
const User = require('../src/models/User');
const Medicine = require('../src/models/Medicine');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');

async function seedOrders() {
  try {
    // Clear existing orders
    await Order.deleteMany({});
    console.log('Existing orders cleared');
    
    // Get users and medicines
    const users = await User.find();
    const medicines = await Medicine.find();
    
    if (users.length === 0 || medicines.length === 0) {
      console.log('No users or medicines found. Please seed the database first.');
      process.exit(1);
    }
    
    // Get seller user
    const sellerUser = users.find(user => user.role === 'seller');
    if (!sellerUser) {
      console.log('No seller user found. Please seed users first.');
      process.exit(1);
    }
    
    // Create sample orders with different payment statuses
    const orders = [
      {
        user: sellerUser._id,
        items: [
          {
            medicine: medicines[0]._id,
            quantity: 2,
            price: medicines[0].price
          },
          {
            medicine: medicines[1]._id,
            quantity: 1,
            price: medicines[1].price
          }
        ],
        totalAmount: (medicines[0].price * 2) + medicines[1].price,
        status: 'delivered',
        paymentStatus: 'paid',
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      {
        user: sellerUser._id,
        items: [
          {
            medicine: medicines[2]._id,
            quantity: 1,
            price: medicines[2].price
          }
        ],
        totalAmount: medicines[2].price,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      },
      {
        user: sellerUser._id,
        items: [
          {
            medicine: medicines[3]._id,
            quantity: 3,
            price: medicines[3].price
          },
          {
            medicine: medicines[4]._id,
            quantity: 2,
            price: medicines[4].price
          }
        ],
        totalAmount: (medicines[3].price * 3) + (medicines[4].price * 2),
        status: 'shipped',
        paymentStatus: 'paid',
        shippingAddress: {
          street: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        }
      },
      {
        user: sellerUser._id,
        items: [
          {
            medicine: medicines[5]._id,
            quantity: 1,
            price: medicines[5].price
          }
        ],
        totalAmount: medicines[5].price,
        status: 'pending',
        paymentStatus: 'pending',
        shippingAddress: {
          street: '321 Elm St',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001',
          country: 'USA'
        }
      },
      {
        user: sellerUser._id,
        items: [
          {
            medicine: medicines[6]._id,
            quantity: 2,
            price: medicines[6].price
          }
        ],
        totalAmount: medicines[6].price * 2,
        status: 'pending',
        paymentStatus: 'failed',
        shippingAddress: {
          street: '654 Maple Ave',
          city: 'Phoenix',
          state: 'AZ',
          zipCode: '85001',
          country: 'USA'
        }
      }
    ];
    
    // Create orders
    const createdOrders = await Order.insertMany(orders);
    console.log(`Created ${createdOrders.length} orders`);
    
    console.log('Order seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
}

seedOrders();