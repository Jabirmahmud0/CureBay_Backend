const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../src/models/Category');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');

// Generate 20 diverse categories with icons and colors
const categories = [
  { 
    name: "Tablets", 
    description: "Oral tablets for various health conditions",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format",
    icon: "Pill",
    color: "cyan"
  },
  { 
    name: "Capsules", 
    description: "Easy-to-swallow capsules with precise dosing",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format",
    icon: "Circle",
    color: "green"
  },
  { 
    name: "Syrups", 
    description: "Liquid medications for easy consumption",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format",
    icon: "Heart",
    color: "pink"
  },
  { 
    name: "Injections", 
    description: "Injectable medications for immediate effect",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&auto=format",
    icon: "Syringe",
    color: "red"
  },
  { 
    name: "Supplements", 
    description: "Vitamins, minerals, and health supplements",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format",
    icon: "Stethoscope",
    color: "orange"
  },
  { 
    name: "Ointments", 
    description: "Topical treatments for skin conditions",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format",
    icon: "Tag",
    color: "gray"
  },
  { 
    name: "Drops", 
    description: "Liquid medications for eyes, ears, and nose",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format",
    icon: "Pill",
    color: "cyan"
  },
  { 
    name: "Inhalers", 
    description: "Respiratory treatments for asthma and allergies",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format",
    icon: "Stethoscope",
    color: "green"
  },
  { 
    name: "Patches", 
    description: "Transdermal patches for continuous medication delivery",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&auto=format",
    icon: "Tag",
    color: "pink"
  },
  { 
    name: "Powders", 
    description: "Powdered medications for mixing with liquids",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format",
    icon: "Circle",
    color: "orange"
  },
  { 
    name: "Suspensions", 
    description: "Liquid suspensions for pediatric use",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format",
    icon: "Heart",
    color: "red"
  },
  { 
    name: "Effervescent", 
    description: "Fizzing tablets that dissolve in water",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format",
    icon: "Pill",
    color: "cyan"
  },
  { 
    name: "Chewables", 
    description: "Chewable tablets for easier consumption",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format",
    icon: "Circle",
    color: "green"
  },
  { 
    name: "Lozenges", 
    description: "Slow-dissolving tablets for throat relief",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&auto=format",
    icon: "Heart",
    color: "pink"
  },
  { 
    name: "Sprays", 
    description: "Metered sprays for nasal and oral applications",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format",
    icon: "Syringe",
    color: "red"
  },
  { 
    name: "Gels", 
    description: "Topical gels for pain and inflammation",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format",
    icon: "Tag",
    color: "gray"
  },
  { 
    name: "Liquids", 
    description: "Liquid formulations for easy dosing",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format",
    icon: "Heart",
    color: "cyan"
  },
  { 
    name: "Suppositories", 
    description: "Rectal medications for systemic delivery",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format",
    icon: "Pill",
    color: "orange"
  },
  { 
    name: "Nebulizers", 
    description: "Liquid medications for nebulizer treatments",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&auto=format",
    icon: "Stethoscope",
    color: "green"
  },
  { 
    name: "Others", 
    description: "Other medical products and equipment",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format",
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