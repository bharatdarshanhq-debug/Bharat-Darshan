/**
 * Database Seeding Script - Hotels
 * Adds sample hotel data for testing the Hotel Selection feature.
 * 
 * Run with: node scripts/seedHotels.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Hotel = require('../models/Hotel');

const hotelsData = [
  // PURI
  {
    name: "Mayfair Heritage",
    destination: "Puri",
    location: "Chakra Tirtha Road, Puri",
    packageType: ["Elite", "Premium"],
    images: ["https://pix10.agoda.net/hotelImages/287/287239/287239_15062410370030805166.jpg?s=1024x768"],
    amenities: ["Swimming Pool", "Spa", "Private Beach", "Bar"],
    description: "Luxury heritage resort facing the beach.",
    rating: 4.5
  },
  {
    name: "Hans Coco Palm",
    destination: "Puri",
    location: "Swargadwar, Puri",
    packageType: ["Pro", "Premium"],
    images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/48698188.jpg?k=15d6c8e3e4a9e4a3e4a9e4a3e4a9e4a3e4a9e4a3e4a9e4a3"],
    amenities: ["Pool", "Restaurant", "Garden"],
    description: "Comfortable stay with modern amenities.",
    rating: 4.0
  },
  {
    name: "Hotel Sonali",
    destination: "Puri",
    location: "VIP Road, Puri",
    packageType: ["Pro"],
    images: ["https://lh3.googleusercontent.com/p/AF1QipN3y4y4y4y4y4y4y4y4y4y4y4y4y4y4y4y4y4"],
    amenities: ["Restaurant", "AC", "WiFi"],
    description: "Budget friendly hotel near the beach.",
    rating: 3.5
  },
  // NEW TEST HOTELS (PREMIUM - PURI)
  {
    name: "Blue Lily Beach Resort",
    destination: "Puri",
    location: "Baliapanda, Puri",
    packageType: ["Premium"],
    images: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/4b/5d/c8/blue-lily-beach-resort.jpg?w=1200&h=-1&s=1"],
    amenities: ["Pool", "Beach Access", "Gym", "Restaurant"],
    description: "Premium resort with excellent sea views.",
    rating: 4.4
  },
  {
    name: "Sterling Puri",
    destination: "Puri",
    location: "Sipasarubali Village, Puri",
    packageType: ["Premium"],
    images: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/9c/0b/4e/facade.jpg?w=1200&h=-1&s=1"],
    amenities: ["Spa", "Multi-cuisine Restaurant", "Game Room"],
    description: "Experience luxury where the river meets the sea.",
    rating: 4.6
  },
  {
    name: "Pride Ananya Resort",
    destination: "Puri",
    location: "VIP Road, Puri",
    packageType: ["Premium"],
    images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/156468205.jpg?k=7a2c8c4370f146901962319082983b6329380962776829777174676"],
    amenities: ["Swimming Pool", "Banquet", "Fine Dining"],
    description: "Modern comforts in the heart of Puri.",
    rating: 4.2
  },
  {
    name: "The Chariot Resort & Spa",
    destination: "Puri",
    location: "Sipasarubali, Puri",
    packageType: ["Premium"],
    images: ["https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/1d/d2/55/the-chariot-resort-spa.jpg?w=1200&h=-1&s=1"],
    amenities: ["Large Pool", "Ayurvedic Spa", "Private Balcony"],
    description: "Sprawling resort perfect for families.",
    rating: 4.3
  },
  {
    name: "Holiday Resort",
    destination: "Puri",
    location: "Chakra Tirtha Road, Puri",
    packageType: ["Premium"],
    images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/48624233.jpg?k=06767676767676767676767676767676767676767676767676767676"],
    amenities: ["Private Beach Area", "Swimming Pool", "Bakery"],
    description: "Classic favorite located right on the beach.",
    rating: 4.5
  },

  // BHUBANESWAR
  {
    name: "Mayfair Lagoon",
    destination: "Bhubaneswar",
    location: "Jayadev Vihar",
    packageType: ["Elite"],
    images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/49842544.jpg?k=4b8e2b8c8d8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8b"],
    amenities: ["Lagoon", "Multiple Restaurants", "Spa", "Pool"],
    description: "5-Star luxury resort in the heart of the city.",
    rating: 5.0
  },
  {
    name: "The HHI Bhubaneswar",
    destination: "Bhubaneswar",
    location: "Kharavela Nagar",
    packageType: ["Premium", "Pro"],
    images: ["https://cf.bstatic.com/xdata/images/hotel/max1024x768/198765432.jpg"],
    amenities: ["Pool", "Gym", "Bar"],
    description: "Premium hotel suitable for business and leisure.",
    rating: 4.2
  },

  // CHILIKA
  {
    name: "Swarajya Island Resort",
    destination: "Chilika",
    location: "Satapada",
    packageType: ["Premium", "Pro"],
    images: ["https://example.com/chilika-resort.jpg"], // Placeholder
    amenities: ["Boating", "Restaurant", "Nature View"],
    description: "Eco-friendly resort surrounded by the lagoon.",
    rating: 4.3
  },
  {
    name: "Eco Retreat Houseboat",
    destination: "Chilika",
    location: "Barkul",
    packageType: ["Elite"],
    images: ["https://example.com/houseboat.jpg"], // Placeholder
    amenities: ["Private Deck", "Chef", "Luxury Room"],
    description: "Floating luxury on Chilika lake.",
    rating: 4.9
  },

  // KONARK
  {
    name: "Eco Retreat Konark",
    destination: "Konark",
    location: "Konark Beach",
    packageType: ["Elite", "Premium", "Pro"],
    images: ["https://example.com/glamping.jpg"], // Placeholder
    amenities: ["Glamping Tent", "Beach Access", "Cultural Events"],
    description: "Luxury camping experience by the beach.",
    rating: 4.7
  }
];

const seedHotels = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing hotels
    await Hotel.deleteMany({});
    console.log('🗑️  Cleared existing hotels');

    // Insert new hotels
    const hotels = await Hotel.insertMany(hotelsData);
    console.log(`✅ Inserted ${hotels.length} hotels`);

    console.log('\n🎉 Hotel data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding hotels:', error);
    process.exit(1);
  }
};

seedHotels();
