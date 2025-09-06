const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HeroSlide = require('../src/models/HeroSlide');
const Banner = require('../src/models/Banner');
const Medicine = require('../src/models/Medicine');
const Category = require('../src/models/Category');
const User = require('../src/models/User');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');

// Sample hero slides data
const heroSlides = [
  {
    title: "Summer Health Essentials",
    subtitle: "Stay Healthy This Summer",
    description: "Discover our curated selection of summer health products to keep you feeling your best all season long.",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=600&fit=crop&auto=format",
    buttonText: "Shop Now",
    buttonLink: "/shop",
    active: true,
    backgroundColor: "from-cyan-500 to-blue-500",
    lightBackground: "from-cyan-50 to-blue-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 1
  },
  {
    title: "Vitamins & Supplements",
    subtitle: "Boost Your Immunity",
    description: "Premium vitamins and supplements to support your overall health and well-being.",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=600&fit=crop&auto=format",
    buttonText: "Explore Collection",
    buttonLink: "/shop/category/supplements",
    active: true,
    backgroundColor: "from-purple-500 to-pink-500",
    lightBackground: "from-purple-50 to-pink-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 2
  },
  {
    title: "Prescription Medications",
    subtitle: "Convenient & Secure",
    description: "Get your prescriptions delivered right to your doorstep with our secure pharmacy service.",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&h=600&fit=crop&auto=format",
    buttonText: "Upload Prescription",
    buttonLink: "/prescription",
    active: true,
    backgroundColor: "from-green-500 to-teal-500",
    lightBackground: "from-green-50 to-teal-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 3
  }
];

// Sample banners data
const banners = [
  {
    title: "Free Shipping on Orders Over $50",
    description: "Limited time offer - Order now!",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=300&fit=crop&auto=format",
    link: "/shop",
    active: true,
    order: 1
  },
  {
    title: "Buy 2 Get 1 Free on Vitamins",
    description: "Hurry, offer ends soon!",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=300&fit=crop&auto=format",
    link: "/shop/category/vitamins",
    active: true,
    order: 2
  },
  {
    title: "New Arrivals - Shop Now",
    description: "Check out our latest health products",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&h=300&fit=crop&auto=format",
    link: "/new-arrivals",
    active: true,
    order: 3
  }
];

// Sample categories - 20 diverse categories
const categories = [
  { 
    name: "Tablets", 
    description: "Oral tablets for various health conditions",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Capsules", 
    description: "Easy-to-swallow capsules with precise dosing",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Syrups", 
    description: "Liquid medications for easy consumption",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Injections", 
    description: "Injectable medications for immediate effect",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Supplements", 
    description: "Vitamins, minerals, and health supplements",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Ointments", 
    description: "Topical treatments for skin conditions",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Drops", 
    description: "Liquid medications for eyes, ears, and nose",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Inhalers", 
    description: "Respiratory treatments for asthma and allergies",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Patches", 
    description: "Transdermal patches for continuous medication delivery",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Powders", 
    description: "Powdered medications for mixing with liquids",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Suspensions", 
    description: "Liquid suspensions for pediatric use",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Effervescent", 
    description: "Fizzing tablets that dissolve in water",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Chewables", 
    description: "Chewable tablets for easier consumption",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Lozenges", 
    description: "Slow-dissolving tablets for throat relief",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Sprays", 
    description: "Metered sprays for nasal and oral applications",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Gels", 
    description: "Topical gels for pain and inflammation",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Liquids", 
    description: "Liquid formulations for easy dosing",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Suppositories", 
    description: "Rectal medications for systemic delivery",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Nebulizers", 
    description: "Liquid medications for nebulizer treatments",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&auto=format"
  },
  { 
    name: "Others", 
    description: "Other medical products and equipment",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format"
  }
];

// Sample medicines
const medicines = [
  {
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    description: "Effective pain relief and fever reducer for adults and children",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format",
    company: "PharmaCorp",
    massUnit: "500mg",
    price: 25.99,
    discountPercentage: 23,
    inStock: true,
    stockQuantity: 150
  },
  {
    name: "Cough Syrup 100ml",
    genericName: "Dextromethorphan",
    description: "Natural cough relief formula with honey and herbal extracts",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format",
    company: "MediCare",
    massUnit: "100ml",
    price: 18.50,
    discountPercentage: 30,
    inStock: true,
    stockQuantity: 200
  },
  {
    name: "Vitamin D3 Capsules",
    genericName: "Cholecalciferol",
    description: "Essential vitamin for bone health and immune system support",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format",
    company: "HealthPlus",
    massUnit: "1000 IU",
    price: 32.00,
    discountPercentage: 22,
    inStock: true,
    stockQuantity: 300
  },
  {
    name: "Antibiotic Capsules",
    genericName: "Amoxicillin",
    description: "Broad spectrum antibiotic treatment for bacterial infections",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop&auto=format",
    company: "BioMed",
    massUnit: "500mg",
    price: 45.99,
    discountPercentage: 24,
    inStock: true,
    stockQuantity: 120
  },
  {
    name: "Pain Relief Gel",
    genericName: "Diclofenac",
    description: "Fast-acting topical pain relief gel for muscle and joint pain",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=300&fit=crop&auto=format",
    company: "TopicalCare",
    massUnit: "50g",
    price: 22.99,
    discountPercentage: 26,
    inStock: true,
    stockQuantity: 180
  },
  {
    name: "Multivitamin Tablets",
    genericName: "Multivitamin Complex",
    description: "Complete daily nutrition support with essential vitamins and minerals",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop&auto=format",
    company: "VitaLife",
    massUnit: "30 tablets",
    price: 28.99,
    discountPercentage: 24,
    inStock: true,
    stockQuantity: 250
  },
  {
    name: "Omega-3 Fish Oil",
    genericName: "Omega-3 Fatty Acids",
    description: "Premium fish oil capsules for heart and brain health",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format",
    company: "MarineHealth",
    massUnit: "1000mg",
    price: 39.99,
    discountPercentage: 25,
    inStock: true,
    stockQuantity: 400
  },
  {
    name: "Insulin Pen",
    genericName: "Human Insulin",
    description: "Fast-acting insulin pen for diabetes management",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=300&h=300&fit=crop&auto=format",
    company: "DiabetCare",
    massUnit: "100 units/ml",
    price: 85.99,
    discountPercentage: 19,
    inStock: true,
    stockQuantity: 75
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await HeroSlide.deleteMany({});
    await Banner.deleteMany({});
    await Category.deleteMany({});
    await Medicine.deleteMany({});
    await User.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Create categories first
    const createdCategories = await Category.insertMany(categories);
    console.log(`Created ${createdCategories.length} categories`);
    
    // Create a sample seller user
    const sellerUser = await User.create({
      name: "Pharma Seller",
      email: "seller@example.com",
      password: "password123",
      role: "seller"
    });
    console.log('Created seller user');
    
    // Update medicines with category and seller references
    const medicinesWithRefs = medicines.map((medicine, index) => ({
      ...medicine,
      category: createdCategories[index % createdCategories.length]._id,
      seller: sellerUser._id
    }));
    
    // Create medicines
    const createdMedicines = await Medicine.insertMany(medicinesWithRefs);
    console.log(`Created ${createdMedicines.length} medicines`);
    
    // Update hero slides with featured medicine references
    const heroSlidesWithRefs = heroSlides.map((slide, index) => {
      if (index < createdMedicines.length) {
        return {
          ...slide,
          featured: {
            medicine: createdMedicines[index]._id
          }
        };
      }
      return slide;
    });
    
    // Create hero slides
    const createdHeroSlides = await HeroSlide.insertMany(heroSlidesWithRefs);
    console.log(`Created ${createdHeroSlides.length} hero slides`);
    
    // Create banners
    const createdBanners = await Banner.insertMany(banners);
    console.log(`Created ${createdBanners.length} banners`);
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();