const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Medicine = require('../src/models/Medicine');
const Category = require('../src/models/Category');
const User = require('../src/models/User');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');

// Generate diverse medicine names and descriptions
const medicineNames = [
  "Paracetamol", "Ibuprofen", "Aspirin", "Amoxicillin", "Ciprofloxacin",
  "Omeprazole", "Loratadine", "Cetirizine", "Metformin", "Atorvastatin",
  "Amlodipine", "Losartan", "Warfarin", "Levothyroxine", "Prednisone",
  "Albuterol", "Fluticasone", "Sertraline", "Escitalopram", "Tramadol",
  "Morphine", "Fentanyl", "Oxycodone", "Hydrocodone", "Codeine",
  "Diazepam", "Lorazepam", "Clonazepam", "Alprazolam", "Zolpidem",
  "Ondansetron", "Loperamide", "Bisacodyl", "Docusate", "Psyllium",
  "Multivitamin", "Calcium", "Iron", "Vitamin D3", "Vitamin B12",
  "Folic Acid", "Omega-3", "Probiotics", "Melatonin", "Glucosamine",
  "Chondroitin", "Creatine", "Whey Protein", "BCAAs", "Pre-workout",
  "Caffeine", "Ginkgo Biloba", "Echinacea", "Turmeric", "Garlic",
  "Ginger", "Elderberry", "Zinc", "Magnesium", "Potassium"
];

const companies = [
  "PharmaCorp", "MediCare", "HealthPlus", "BioMed", "TopicalCare",
  "VitaLife", "MarineHealth", "DiabetCare", "NeuroPharm", "CardioSafe",
  "OrthoTech", "ImmunoBoost", "SleepWell", "EnergyPlus", "DigestiveHealth",
  "SkinCare", "JointSupport", "BrainBoost", "HeartGuard", "LiverCare"
];

const massUnits = [
  "500mg", "250mg", "100mg", "50mg", "25mg",
  "10mg", "5mg", "1000mg", "750mg", "200mg",
  "10ml", "50ml", "100ml", "200ml", "500ml",
  "1g", "2g", "5g", "10g", "30 tablets",
  "60 capsules", "1 strip", "1 box", "1 bottle", "1 pack"
];

const descriptions = [
  "Effective treatment for pain and fever reduction",
  "Anti-inflammatory medication for swelling and pain",
  "Blood thinner to prevent heart attacks and strokes",
  "Antibiotic for bacterial infections",
  "Antacid for heartburn and acid reflux",
  "Antihistamine for allergies and hay fever",
  "Diabetes medication for blood sugar control",
  "Cholesterol-lowering medication",
  "Blood pressure medication for hypertension",
  "Thyroid hormone replacement therapy",
  "Steroid for inflammation and immune conditions",
  "Bronchodilator for asthma and breathing difficulties",
  "Antidepressant for mood disorders",
  "Pain reliever for moderate to severe pain",
  "Muscle relaxant for tension and spasms",
  "Anti-anxiety medication for stress and panic",
  "Sleep aid for insomnia and restlessness",
  "Antibiotic for urinary tract infections",
  "Antifungal for skin and nail infections",
  "Vitamin supplement for overall health"
];

// List of local medicine images
const medicineImages = [
  "/medicine/med_1.jpeg",
  "/medicine/med_1.jpg",
  "/medicine/med_1.png",
  "/medicine/med_2.jpg",
  "/medicine/med_2.png",
  "/medicine/med_3.jpg",
  "/medicine/med_3.png",
  "/medicine/med_4.jpg",
  "/medicine/med_4.png",
  "/medicine/med_5.jpg",
  "/medicine/med_5.png",
  "/medicine/med_6.jpg",
  "/medicine/med_6.png",
  "/medicine/med_7.jpg",
  "/medicine/med_7.png",
  "/medicine/med_8.png",
  "/medicine/med_9.png",
  "/medicine/med_10.png",
  "/medicine/capsule.jpg",
  "/medicine/chewable.png",
  "/medicine/drops.png",
  "/medicine/inhaler.png"
];

// Generate 10 medicines for each category
async function generateMedicines() {
  try {
    // Get all categories
    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories`);
    
    // Get all seller users
    const sellerUsers = await User.find({ role: "seller" });
    if (sellerUsers.length < 2) {
      console.error("At least 2 seller users are required. Please run seedData.js first to create sellers.");
      process.exit(1);
    }
    
    console.log(`Found ${sellerUsers.length} sellers`);
    
    // Clear existing medicines
    await Medicine.deleteMany({});
    console.log('Existing medicines cleared');
    
    let totalMedicines = 0;
    
    // Generate 10 medicines for each category
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      const medicines = [];
      
      for (let j = 0; j < 10; j++) {
        const medicineIndex = (i * 10 + j) % medicineNames.length;
        const companyIndex = (i * 10 + j) % companies.length;
        const massUnitIndex = (i * 10 + j) % massUnits.length;
        const descIndex = (i * 10 + j) % descriptions.length;
        const imageIndex = (i * 10 + j) % medicineImages.length;
        
        // Distribute medicines between sellers (alternate between sellers)
        const sellerIndex = (i * 10 + j) % sellerUsers.length;
        
        medicines.push({
          name: `${medicineNames[medicineIndex]} ${massUnits[massUnitIndex]}`,
          genericName: medicineNames[medicineIndex],
          description: descriptions[descIndex],
          image: medicineImages[imageIndex],
          company: companies[companyIndex],
          massUnit: massUnits[massUnitIndex],
          price: parseFloat((Math.random() * 100 + 5).toFixed(2)),
          discountPercentage: Math.floor(Math.random() * 30),
          inStock: Math.random() > 0.1, // 90% chance of being in stock
          stockQuantity: Math.floor(Math.random() * 500) + 10,
          category: category._id,
          seller: sellerUsers[sellerIndex]._id
        });
      }
      
      // Insert medicines for this category
      const createdMedicines = await Medicine.insertMany(medicines);
      totalMedicines += createdMedicines.length;
      console.log(`Created ${createdMedicines.length} medicines for category: ${category.name}`);
    }
    
    // Show distribution of medicines among sellers
    for (let i = 0; i < sellerUsers.length; i++) {
      const count = await Medicine.countDocuments({ seller: sellerUsers[i]._id });
      console.log(`Seller ${sellerUsers[i].email} has ${count} medicines`);
    }
    
    console.log(`Total medicines created: ${totalMedicines}`);
    console.log('Medicine seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding medicines:', error);
    process.exit(1);
  }
}

generateMedicines();