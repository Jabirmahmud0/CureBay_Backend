"use strict";
const mongoose = require('mongoose');
require('dotenv').config();
// Database connection
async function testDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');
        console.log('MongoDB connected successfully');
        // Try to fetch data from Users collection
        const User = require('./models/User');
        const users = await User.find({});
        console.log(`Found ${users.length} users in the database`);
        console.log(users);
        // Try to fetch data from Categories collection
        const Category = require('./models/Category');
        const categories = await Category.find({});
        console.log(`Found ${categories.length} categories in the database`);
        console.log(categories);
        // Try to fetch data from Medicines collection
        const Medicine = require('./models/Medicine');
        const medicines = await Medicine.find({}).limit(5);
        console.log(`Found ${medicines.length} medicines in the database`);
        console.log(medicines);
        mongoose.connection.close();
    }
    catch (error) {
        console.error('Error:', error);
    }
}
testDB();
