const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Medicine = require('./src/models/Medicine');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');

async function checkSellers() {
  try {
    // Get all seller users
    const sellerUsers = await User.find({ role: "seller" });
    console.log(`Found ${sellerUsers.length} sellers:`);
    
    for (let i = 0; i < sellerUsers.length; i++) {
      const seller = sellerUsers[i];
      console.log(`${i + 1}. ${seller.name} (${seller.email}) - ID: ${seller._id}`);
      
      // Count medicines for this seller
      const medicineCount = await Medicine.countDocuments({ seller: seller._id });
      console.log(`   Medicines: ${medicineCount}`);
    }
    
    // Total medicine count
    const totalMedicines = await Medicine.countDocuments({});
    console.log(`\nTotal medicines in database: ${totalMedicines}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error checking sellers:', error);
    mongoose.connection.close();
  }
}

checkSellers();