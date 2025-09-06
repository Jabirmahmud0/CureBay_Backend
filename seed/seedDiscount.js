const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('../src/models/Medicine');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');

async function seedDiscountedMedicines() {
  try {
    // Get medicines and update 15 of them to have higher discounts (25-50%)
    const medicines = await Medicine.find({}).limit(15);
    
    if (medicines.length === 0) {
      console.log("No medicines found. Please run seedMedicines.js first.");
      process.exit(1);
    }
    
    // Update each medicine with a higher discount
    for (let i = 0; i < medicines.length; i++) {
      const medicine = medicines[i];
      // Set discount between 25-50%
      const discount = 25 + Math.floor(Math.random() * 26);
      
      await Medicine.findByIdAndUpdate(medicine._id, {
        discountPercentage: discount
      });
    }
    
    console.log(`Updated ${medicines.length} medicines with higher discounts (25-50%)`);
    console.log('Discount seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding discounted medicines:', error);
    process.exit(1);
  }
}

seedDiscountedMedicines();