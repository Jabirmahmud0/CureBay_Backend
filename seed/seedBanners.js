const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Banner = require('../src/models/Banner');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');

// Generate 10 banners with diverse content
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
  },
  {
    title: "50% Off Prescription Medications",
    description: "This week only - Save on your prescriptions",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&h=300&fit=crop&auto=format",
    link: "/prescriptions",
    active: true,
    order: 4
  },
  {
    title: "Free Health Consultation",
    description: "Book your free consultation with our pharmacists",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=300&fit=crop&auto=format",
    link: "/consultation",
    active: true,
    order: 5
  },
  {
    title: "Back to School Health Kit",
    description: "Essential health products for students",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&h=300&fit=crop&auto=format",
    link: "/shop/category/school-health",
    active: true,
    order: 6
  },
  {
    title: "Senior Citizen Discount - 15% Off",
    description: "Special discounts for our senior customers",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=300&fit=crop&auto=format",
    link: "/senior-discount",
    active: true,
    order: 7
  },
  {
    title: "Wellness Wednesday - 20% Off Supplements",
    description: "Weekly wellness deals on all supplements",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=1200&h=300&fit=crop&auto=format",
    link: "/wellness-wednesday",
    active: true,
    order: 8
  },
  {
    title: "Flash Sale - 30% Off Pain Relief",
    description: "Today only - Don't miss out on these savings",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1200&h=300&fit=crop&auto=format",
    link: "/flash-sale",
    active: true,
    order: 9
  },
  {
    title: "Subscribe & Save - 10% Off Monthly",
    description: "Subscribe to your regular medications and save",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=300&fit=crop&auto=format",
    link: "/subscribe",
    active: true,
    order: 10
  }
];

async function seedBanners() {
  try {
    // Clear existing banners
    await Banner.deleteMany({});
    console.log('Existing banners cleared');
    
    // Create new banners
    const createdBanners = await Banner.insertMany(banners);
    console.log(`Created ${createdBanners.length} banners`);
    
    console.log('Banner seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding banners:', error);
    process.exit(1);
  }
}

seedBanners();