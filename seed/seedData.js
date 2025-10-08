// Seed data for CureBay application
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Medicine = require('../src/models/Medicine');
const HeroSlide = require('../src/models/HeroSlide');
const Banner = require('../src/models/Banner');
const Order = require('../src/models/Order');
const Coupon = require('../src/models/Coupon');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/curebay', {
  // Remove deprecated options
});

// Sample users
const users = [
  {
    name: 'Admin User',
    email: 'admin@curebay.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567890',
    address: '123 Admin St, Admin City, Admin State 12345, Admin Country'
  },
  {
    name: 'Seller User',
    email: 'seller@curebay.com',
    password: 'seller123',
    role: 'seller',
    phone: '+1234567891',
    address: '456 Seller St, Seller City, Seller State 67890, Seller Country'
  },
  {
    name: 'Customer User',
    email: 'customer@curebay.com',
    password: 'customer123',
    role: 'user',
    phone: '+1234567892',
    address: '789 Customer St, Customer City, Customer State 54321, Customer Country'
  }
];

// Sample categories
const categories = [
  { 
    name: 'Pain Relief', 
    description: 'Medications for pain management',
    image: 'https://placehold.co/300x300/4F46E5/FFFFFF?text=Pain+Relief'
  },
  { 
    name: 'Cold & Flu', 
    description: 'Treatments for cold and flu symptoms',
    image: 'https://placehold.co/300x300/0EA5E9/FFFFFF?text=Cold+%26+Flu'
  },
  { 
    name: 'Vitamins & Supplements', 
    description: 'Vitamins and dietary supplements',
    image: 'https://placehold.co/300x300/10B981/FFFFFF?text=Vitamins'
  },
  { 
    name: 'Digestive Health', 
    description: 'Medications for digestive issues',
    image: 'https://placehold.co/300x300/F59E0B/FFFFFF?text=Digestive'
  },
  { 
    name: 'Allergy', 
    description: 'Allergy relief medications',
    image: 'https://placehold.co/300x300/EF4444/FFFFFF?text=Allergy'
  },
  { 
    name: 'Skin Care', 
    description: 'Topical treatments and skincare products',
    image: 'https://placehold.co/300x300/8B5CF6/FFFFFF?text=Skin+Care'
  }
];

// Sample medicines
const medicines = [
  {
    name: 'Paracetamol 500mg',
    genericName: 'Acetaminophen',
    description: 'Effective pain reliever and fever reducer',
    category: null, // Will be populated later
    company: 'MediCorp',
    massUnit: 'Tablet',
    price: 5.99,
    discountPercentage: 10,
    seller: null, // Will be populated later
    inStock: true,
    stockQuantity: 1000,
    image: 'https://placehold.co/300x300/4F46E5/FFFFFF?text=Paracetamol'
  },
  {
    name: 'Ibuprofen 200mg',
    genericName: 'Ibuprofen',
    description: 'Non-steroidal anti-inflammatory drug for pain and inflammation',
    category: null,
    company: 'PharmaPlus',
    massUnit: 'Tablet',
    price: 7.49,
    discountPercentage: 0,
    seller: null,
    inStock: true,
    stockQuantity: 500,
    image: 'https://placehold.co/300x300/0EA5E9/FFFFFF?text=Ibuprofen'
  },
  {
    name: 'Vitamin C 1000mg',
    genericName: 'Ascorbic Acid',
    description: 'Essential vitamin for immune system support',
    category: null,
    company: 'HealthFirst',
    massUnit: 'Tablet',
    price: 12.99,
    discountPercentage: 15,
    seller: null,
    inStock: true,
    stockQuantity: 300,
    image: 'https://placehold.co/300x300/10B981/FFFFFF?text=Vitamin+C'
  },
  {
    name: 'Loratadine 10mg',
    genericName: 'Loratadine',
    description: 'Non-drowsy antihistamine for allergy relief',
    category: null,
    company: 'AllergyCare',
    massUnit: 'Tablet',
    price: 8.99,
    discountPercentage: 5,
    seller: null,
    inStock: true,
    stockQuantity: 400,
    image: 'https://placehold.co/300x300/EF4444/FFFFFF?text=Loratadine'
  },
  {
    name: 'Omeprazole 20mg',
    genericName: 'Omeprazole',
    description: 'Proton pump inhibitor for acid reflux and heartburn',
    category: null,
    company: 'DigestiveHealth',
    massUnit: 'Capsule',
    price: 15.99,
    discountPercentage: 0,
    seller: null,
    inStock: true,
    stockQuantity: 250,
    image: 'https://placehold.co/300x300/F59E0B/FFFFFF?text=Omeprazole'
  }
];

// Sample hero slides
const heroSlides = [
  {
    title: 'Summer Health Sale',
    subtitle: 'Up to 30% Off',
    description: 'Stay healthy this summer with our exclusive discounts on vitamins and supplements',
    image: 'https://placehold.co/1200x400/4F46E5/FFFFFF?text=Summer+Health+Sale',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    backgroundColor: 'from-cyan-600 to-cyan-800',
    textColor: 'text-white',
    isActive: true
  },
  {
    title: 'New Arrivals',
    subtitle: 'Fresh Stock Daily',
    description: 'Discover our latest health and wellness products',
    image: 'https://placehold.co/1200x400/0EA5E9/FFFFFF?text=New+Arrivals',
    buttonText: 'Explore',
    buttonLink: '/shop',
    backgroundColor: 'from-blue-500 to-blue-700',
    textColor: 'text-white',
    isActive: true
  }
];

// Sample banners
const banners = [
  {
    title: 'Free Shipping',
    description: 'On orders over $50',
    image: 'https://placehold.co/300x200/10B981/FFFFFF?text=Free+Shipping',
    link: '/shop',
    priority: 1,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
  },
  {
    title: 'Flash Sale',
    description: 'Limited time offer - 25% off',
    image: 'https://placehold.co/300x200/EF4444/FFFFFF?text=Flash+Sale',
    link: '/discounts',
    priority: 2,
    isActive: true,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
];

// Sample coupons
const coupons = [
  {
    code: 'WELCOME10',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrderAmount: 25,
    startDate: new Date(),
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    isActive: true,
    createdBy: null // Will be populated later
  },
  {
    code: 'SAVE20',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrderAmount: 50,
    maximumDiscountAmount: 25,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    isActive: true,
    createdBy: null
  },
  {
    code: 'FREESHIP',
    discountType: 'fixed',
    discountValue: 10,
    minimumOrderAmount: 30,
    startDate: new Date(),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    isActive: true,
    createdBy: null
  }
];

// Seed function
const seedDB = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Medicine.deleteMany({});
    await HeroSlide.deleteMany({});
    await Banner.deleteMany({});
    await Order.deleteMany({});
    await Coupon.deleteMany({});
    
    // Create users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers.find(user => user.role === 'admin');
    const sellerUser = createdUsers.find(user => user.role === 'seller');
    
    // Create categories
    const createdCategories = await Category.insertMany(categories);
    
    // Update medicines with category and seller references
    medicines.forEach(medicine => {
      medicine.category = createdCategories[0]._id; // Assign first category as default
      medicine.seller = sellerUser._id;
    });
    
    // Create medicines
    const createdMedicines = await Medicine.insertMany(medicines);
    
    // Update hero slides with seller reference
    heroSlides.forEach(slide => {
      slide.seller = sellerUser._id;
    });
    
    // Create hero slides
    await HeroSlide.insertMany(heroSlides);
    
    // Update banners with seller reference
    banners.forEach(banner => {
      banner.seller = sellerUser._id;
    });
    
    // Create banners
    await Banner.insertMany(banners);
    
    // Update coupons with creator reference
    coupons.forEach(coupon => {
      coupon.createdBy = adminUser._id;
    });
    
    // Create coupons
    await Coupon.insertMany(coupons);
    
    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

// Run seed function
seedDB();