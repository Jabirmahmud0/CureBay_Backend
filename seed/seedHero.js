const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HeroSlide = require('../src/models/HeroSlide');
const Medicine = require('../src/models/Medicine');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/curebay');

// Generate 10 hero slides with diverse content using local medicine images
const heroSlides = [
  {
    title: "Summer Health Essentials",
    subtitle: "Stay Healthy This Summer",
    description: "Discover our curated selection of summer health products to keep you feeling your best all season long.",
    image: "/medicine/med_1.jpg",
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
    image: "/medicine/med_2.jpg",
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
    image: "/medicine/med_3.jpg",
    buttonText: "Upload Prescription",
    buttonLink: "/prescription",
    active: true,
    backgroundColor: "from-green-500 to-teal-500",
    lightBackground: "from-green-50 to-teal-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 3
  },
  {
    title: "Back to School Health",
    subtitle: "Essential Health Products",
    description: "Keep your family healthy with our back-to-school essentials and health products.",
    image: "/medicine/med_4.jpg",
    buttonText: "Shop School Essentials",
    buttonLink: "/shop/category/school-health",
    active: true,
    backgroundColor: "from-yellow-500 to-orange-500",
    lightBackground: "from-yellow-50 to-orange-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 4
  },
  {
    title: "Senior Health Care",
    subtitle: "Specialized for Seniors",
    description: "Comprehensive health solutions tailored specifically for our senior community.",
    image: "/medicine/med_5.jpg",
    buttonText: "Explore Senior Care",
    buttonLink: "/shop/category/senior-health",
    active: true,
    backgroundColor: "from-indigo-500 to-purple-500",
    lightBackground: "from-indigo-50 to-purple-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 5
  },
  {
    title: "Mental Wellness",
    subtitle: "Support Your Mental Health",
    description: "Natural supplements and products to support your mental well-being and emotional health.",
    image: "/medicine/med_6.jpg",
    buttonText: "Discover Wellness",
    buttonLink: "/shop/category/mental-wellness",
    active: true,
    backgroundColor: "from-pink-500 to-rose-500",
    lightBackground: "from-pink-50 to-rose-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 6
  },
  {
    title: "Fitness & Sports Nutrition",
    subtitle: "Fuel Your Active Lifestyle",
    description: "Premium supplements and nutrition products for athletes and fitness enthusiasts.",
    image: "/medicine/med_7.jpg",
    buttonText: "Shop Fitness Products",
    buttonLink: "/shop/category/fitness",
    active: true,
    backgroundColor: "from-emerald-500 to-teal-500",
    lightBackground: "from-emerald-50 to-teal-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 7
  },
  {
    title: "Baby & Child Care",
    subtitle: "Gentle Health Solutions",
    description: "Safe and effective health products specially formulated for babies and children.",
    image: "/medicine/med_8.png",
    buttonText: "Shop Baby Care",
    buttonLink: "/shop/category/baby-care",
    active: true,
    backgroundColor: "from-blue-500 to-cyan-500",
    lightBackground: "from-blue-50 to-cyan-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 8
  },
  {
    title: "Skin Care Essentials",
    subtitle: "Healthy Skin, Healthy You",
    description: "Dermatologist-recommended skincare products for all skin types and concerns.",
    image: "/medicine/med_9.png",
    buttonText: "Explore Skincare",
    buttonLink: "/shop/category/skin-care",
    active: true,
    backgroundColor: "from-rose-500 to-pink-500",
    lightBackground: "from-rose-50 to-pink-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 9
  },
  {
    title: "Seasonal Allergy Relief",
    subtitle: "Breathe Easy This Season",
    description: "Effective treatments and preventive measures for seasonal allergies and respiratory issues.",
    image: "/medicine/med_10.png",
    buttonText: "Find Relief",
    buttonLink: "/shop/category/allergy-relief",
    active: true,
    backgroundColor: "from-amber-500 to-yellow-500",
    lightBackground: "from-amber-50 to-yellow-50",
    textColor: "text-white",
    lightTextColor: "text-gray-900",
    order: 10
  }
];

async function seedHeroSlides() {
  try {
    // Clear existing hero slides
    await HeroSlide.deleteMany({});
    console.log('Existing hero slides cleared');
    
    // Get some medicines to feature in hero slides
    const medicines = await Medicine.find({}).limit(10);
    
    // Update hero slides with featured medicine references
    const heroSlidesWithRefs = heroSlides.map((slide, index) => {
      if (index < medicines.length) {
        return {
          ...slide,
          featured: {
            medicine: medicines[index]._id
          }
        };
      }
      return slide;
    });
    
    // Create hero slides
    const createdHeroSlides = await HeroSlide.insertMany(heroSlidesWithRefs);
    console.log(`Created ${createdHeroSlides.length} hero slides`);
    
    console.log('Hero slide seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding hero slides:', error);
    process.exit(1);
  }
}

seedHeroSlides();