/**
 * Database Seeding Script
 * Migrates package data from packages.js to MongoDB
 * 
 * Run with: node scripts/seedPackages.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Destination = require('../models/Destination');
const Package = require('../models/Package');

// Package data (migrated from Frontend/src/data/packages.js)
const packagesData = [
  {
    legacyId: 1,
    name: "Spiritual Puri Yatra",
    primaryDestination: "Puri",
    type: "Pro",
    duration: "3 Days / 2 Nights",
    groupSize: "2-6 People",
    price: 18500,
    originalPrice: 22000,
    rating: 4.8,
    reviews: 124,
    image: "/assets/hero1.webp",
    images: ["/assets/hero-puri-beach.jpg", "/assets/jagannath-temple.jpg"],
    locations: ["Puri", "Raghurajpur"],
    highlights: ["Jagannath Temple", "Beach Resort", "Konark Sun Temple", "Heritage Village"],
    description: "Experience the divine aura of Lord Jagannath and the artistic heritage of Raghurajpur with a comfortable beachside stay.",
    facilities: ["3-Star Beach Resort", "AC Sedan", "Temple Panda Assistance", "Breakfast & Dinner", "Guide"],
    itinerary: [
      { day: 1, title: "Arrival & Divine Blessings", activities: ["Pickup from Puri Station/Bhubaneswar Airport", "Check-in at Beach Resort", "Evening Darshan at Jagannath Temple", "Mahaprasad Dinner"] },
      { day: 2, title: "Sun & Art", activities: ["Sunrise at Golden Beach", "Excursion to Konark Sun Temple", "Visit Raghurajpur Heritage Village", "Evening Beach Market stroll"] },
      { day: 3, title: "Departure", activities: ["Morning Aarti", "Breakfast", "Drop at Station/Airport"] }
    ],
    included: ["Accommodation", "Transport", "Breakfast & Dinner", "Temple Assistance"],
    excluded: ["Lunch", "Personal Expenses"],
    hotelDetails: [
      { city: "Puri", hotel: "Golden Tree / Hans Coco Palm", nights: 2, roomType: "Premium Room" }
    ],
    foodPlan: "MAP Plan (Breakfast & Dinner)",
    pickupDrop: "Included"
  },
  {
    legacyId: 2,
    name: "Royal Puri Luxury",
    primaryDestination: "Puri",
    type: "Elite",
    duration: "4 Days / 3 Nights",
    groupSize: "2-4 People",
    price: 45000,
    originalPrice: 60000,
    rating: 5.0,
    reviews: 48,
    image: "/assets/destination1.webp",
    images: ["/assets/hero-puri-beach.jpg", "/assets/jagannath-temple.jpg"],
    locations: ["Puri", "Marine Drive"],
    highlights: ["Jagannath Temple", "Beach Resort", "Konark Sun Temple", "Heritage Village", "Mayfair Stay", "Private Beach", "VIP Darshan", "Spa"],
    description: "Indulge in ultimate luxury with a stay at Mayfair, VIP temple access, and curated experiences.",
    facilities: ["5-Star Luxury Stay", "Private Butler", "Luxury SUV", "VIP Darshan", "Spa Session"],
    itinerary: [
      { day: 1, title: "Royal Welcome", activities: ["Luxury Pickup", "Check-in at Mayfair Waves/Heritage", "Private Beach Access", "Gala Dinner"] },
      { day: 2, title: "Divine & Historic", activities: ["VIP Jagannath Darshan", "Guided tour of Konark", "Marine Drive sunset cruise"] },
      { day: 3, title: "Relaxation", activities: ["Spa Treatment", "Leisure at resort", "Special Odia Thali Lunch", "Cultural Performance"] },
      { day: 4, title: "Farewell", activities: ["Breakfast", "Luxury Drop to Airport"] }
    ],
    included: ["Luxury Stay", "All Meals", "VIP Darshan", "Spa"],
    excluded: ["Flights", "Shopping"],
    hotelDetails: [
      { city: "Puri", hotel: "Mayfair Waves", nights: 3, roomType: "Premium Suite" }
    ],
    foodPlan: "All Meals Included",
    pickupDrop: "Luxury SUV"
  },
  {
    legacyId: 3,
    name: "Puri Beach Fun",
    primaryDestination: "Puri",
    type: "Premium",
    duration: "2 Days / 1 Night",
    groupSize: "4-10 People",
    price: 5500,
    originalPrice: 7500,
    rating: 4.2,
    reviews: 156,
    image: "/assets/destination6.webp",
    images: ["/assets/hero-puri-beach.jpg"],
    locations: ["Puri"],
    highlights: ["Beach", "Fun", "Budget Friendly", "Group Tour"],
    description: "A quick and affordable getaway to enjoy the golden sands of Puri.",
    facilities: ["Standard Hotel", "AC Bus", "Breakfast", "Sightseeing"],
    itinerary: [
      { day: 1, title: "Beach & Temple", activities: ["Arrival", "Jagannath Temple Darshan", "Golden Beach Fun"] },
      { day: 2, title: "Return", activities: ["Morning Beach Walk", "Drop at Station"] }
    ],
    included: ["Stay", "Breakfast", "Transport"],
    excluded: ["Meals", "Guide"],
    hotelDetails: [
      { city: "Puri", hotel: "Hotel Sonali / Similar", nights: 1, roomType: "Standard Room" }
    ],
    foodPlan: "Breakfast Only",
    pickupDrop: "Station Pickup"
  },
];

// Destination data
const destinationsData = [
  {
    name: "Puri",
    slug: "puri",
    image: "/assets/destination1.webp",
    description: "The holy city of Lord Jagannath, famous for its temples and golden beaches.",
    order: 1,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Destination.deleteMany({});
    await Package.deleteMany({});
    console.log('🗑️  Cleared existing destinations and packages');

    // Insert destinations
    const destinations = await Destination.insertMany(destinationsData);
    console.log(`✅ Inserted ${destinations.length} destinations`);

    // Create destination lookup map
    const destinationMap = {};
    destinations.forEach(dest => {
      destinationMap[dest.name] = dest._id;
    });

    // Insert packages one by one for better error handling
    let successCount = 0;
    for (const pkgData of packagesData) {
      try {
        const packageDoc = new Package({
          ...pkgData,
          destination: destinationMap[pkgData.primaryDestination],
          variant: pkgData.type.toLowerCase(),
        });
        await packageDoc.save();
        successCount++;
      } catch (err) {
        console.error(`❌ Failed to insert package "${pkgData.name}":`, err.message);
      }
    }
    console.log(`✅ Inserted ${successCount} packages`);

    // Update package counts for destinations
    for (const destName of Object.keys(destinationMap)) {
      const count = await Package.countDocuments({ primaryDestination: destName });
      await Destination.findByIdAndUpdate(destinationMap[destName], { packagesCount: count });
    }
    console.log('✅ Updated package counts for destinations');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`   - ${destinations.length} destinations`);
    console.log(`   - ${successCount} packages`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
