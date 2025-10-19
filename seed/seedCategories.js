const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../src/models/Category');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');

// Generate 20 diverse categories with icons and colors using local medicine images
const categories = [
  { 
    name: "Tablets", 
    description: "Oral tablets for various health conditions",
    image: "/medicine/med_1.jpg",
    icon: "Pill",
    color: "cyan"
  },
  { 
    name: "Capsules", 
    description: "Easy-to-swallow capsules with precise dosing",
    image: "/medicine/capsule.jpg",
    icon: "Circle",
    color: "green"
  },
  { 
    name: "Syrups", 
    description: "Liquid medications for easy consumption",
    image: "/medicine/med_2.jpg",
    icon: "Heart",
    color: "pink"
  },
  { 
    name: "Injections", 
    description: "Injectable medications for immediate effect",
    image: "/medicine/med_3.jpg",
    icon: "Syringe",
    color: "red"
  },
  { 
    name: "Supplements", 
    description: "Vitamins, minerals, and health supplements",
    image: "/medicine/med_4.jpg",
    icon: "Stethoscope",
    color: "orange"
  },
  { 
    name: "Ointments", 
    description: "Topical treatments for skin conditions",
    image: "/medicine/med_5.jpg",
    icon: "Tag",
    color: "gray"
  },
  { 
    name: "Drops", 
    description: "Liquid medications for eyes, ears, and nose",
    image: "/medicine/drops.png",
    icon: "Pill",
    color: "cyan"
  },
  { 
    name: "Inhalers", 
    description: "Respiratory treatments for asthma and allergies",
    image: "/medicine/inhaler.png",
    icon: "Stethoscope",
    color: "green"
  },
  { 
    name: "Patches", 
    description: "Transdermal patches for continuous medication delivery",
    image: "/medicine/med_6.jpg",
    icon: "Tag",
    color: "pink"
  },
  { 
    name: "Powders", 
    description: "Powdered medications for mixing with liquids",
    image: "/medicine/med_7.jpg",
    icon: "Circle",
    color: "orange"
  },
  { 
    name: "Suspensions", 
    description: "Liquid suspensions for pediatric use",
    image: "/medicine/med_8.png",
    icon: "Heart",
    color: "red"
  },
  { 
    name: "Effervescent", 
    description: "Fizzing tablets that dissolve in water",
    image: "/medicine/med_9.png",
    icon: "Pill",
    color: "cyan"
  },
  { 
    name: "Chewables", 
    description: "Chewable tablets for easier consumption",
    image: "/medicine/chewable.png",
    icon: "Circle",
    color: "green"
  },
  { 
    name: "Lozenges", 
    description: "Slow-dissolving tablets for throat relief",
    image: "/medicine/med_10.png",
    icon: "Heart",
    color: "pink"
  },
  { 
    name: "Sprays", 
    description: "Metered sprays for nasal and oral applications",
    image: "/medicine/med_1.png",
    icon: "Syringe",
    color: "red"
  },
  { 
    name: "Gels", 
    description: "Topical gels for pain and inflammation",
    image: "/medicine/med_2.png",
    icon: "Tag",
    color: "gray"
  },
  { 
    name: "Liquids", 
    description: "Liquid formulations for easy dosing",
    image: "/medicine/med_3.png",
    icon: "Heart",
    color: "cyan"
  },
  { 
    name: "Suppositories", 
    description: "Rectal medications for systemic delivery",
    image: "/medicine/med_4.png",
    icon: "Pill",
    color: "orange"
  },
  { 
    name: "Nebulizers", 
    description: "Liquid medications for nebulizer treatments",
    image: "/medicine/med_5.png",
    icon: "Stethoscope",
    color: "green"
  },
  { 
    name: "Others", 
    description: "Other medical products and equipment",
    image: "/medicine/med_6.png",
    icon: "Tag",
    color: "gray"
  }
];

async function seedCategories() {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    console.log('Existing categories cleared');
    
    // Create new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);
    
    console.log('Category seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
}

seedCategories();