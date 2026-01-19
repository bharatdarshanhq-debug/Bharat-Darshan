import heroImage from "@/assets/hero-puri-beach.jpg";
import konarkImage from "@/assets/konark-temple.jpg";
import jagannathImage from "@/assets/jagannath-temple.jpg";
import lingarajImage from "@/assets/lingaraj-temple.jpg";

import chilikaImage from "@/assets/destination5.webp";
import destination1 from "@/assets/destination1.webp";
import hero1 from "@/assets/hero1.webp";
import destination6 from "@/assets/destination6.webp";

/**
 * List of tour packages available in the application.
 * Each package contains details like ID, name, destination, type, price, etc.
 * @type {Array<Object>}
 */
export const packages = [
  {
    id: 1,
    name: "Spiritual Puri Yatra",
    primaryDestination: "Puri",
    type: "Pro",
    variant: "pro",
    duration: "3 Days / 2 Nights",
    groupSize: "2-6 People",
    price: 18500,
    originalPrice: 22000,
    rating: 4.8,
    reviews: 124,
    image: hero1,
    images: [heroImage, jagannathImage, konarkImage],
    locations: ["Puri", "Konark", "Raghurajpur"],
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
       { city: "Puri", hotel: "Golden Tree / Hans Coco Palm", nights: 2, type: "Premium Room" }
    ],
    foodPlan: "MAP Plan (Breakfast & Dinner)",
    pickupDrop: "Included"
  },
  {
    id: 2,
    name: "Royal Puri Luxury",
    primaryDestination: "Puri",
    type: "Elite",
    variant: "elite",
    duration: "4 Days / 3 Nights",
    groupSize: "2-4 People",
    price: 45000,
    originalPrice: 60000,
    rating: 5.0,
    reviews: 48,
    image: destination1,
    images: [heroImage, jagannathImage],
    locations: ["Puri", "Konark", "Marine Drive"],
    highlights: ["Jagannath Temple", "Beach Resort", "Konark Sun Temple", "Heritage Village","Mayfair Stay", "Private Beach", "VIP Darshan", "Spa"],
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
       { city: "Puri", hotel: "Mayfair Waves", nights: 3, type: "Premium Suite" }
    ],
    foodPlan: "All Meals Included",
    pickupDrop: "Luxury SUV"
  },
  {
    id: 3,
    name: "Puri Beach Fun",
    primaryDestination: "Puri",
    type: "Premium",
    variant: "premium",
    duration: "2 Days / 1 Night",
    groupSize: "4-10 People",
    price: 5500,
    originalPrice: 7500,
    rating: 4.2,
    reviews: 156,
    image: destination6,
    images: [heroImage],
    locations: ["Puri", "Konark"],
    highlights: ["Beach", "Fun", "Budget Friendly", "Group Tour"],
    description: "A quick and affordable getaway to enjoy the golden sands of Puri and the grandeur of Konark.",
    facilities: ["Standard Hotel", "AC Bus", "Breakfast", "Sightseeing"],
    itinerary: [
      { day: 1, title: "Beach & Temple", activities: ["Arrival", "Jagannath Temple Darshan", "Golden Beach Fun"] },
      { day: 2, title: "Konark & Return", activities: ["Konark Sun Temple", "Chandrabhaga Beach", "Drop at Station"] }
    ],
    included: ["Stay", "Breakfast", "Transport"],
    excluded: ["Meals", "Guide"],
    hotelDetails: [
       { city: "Puri", hotel: "Hotel Sonali / Similar", nights: 1, type: "Standard Room" }
    ],
    foodPlan: "Breakfast Only",
    pickupDrop: "Station Pickup"
  },
  {
    id: 4,
    name: "Chilika Wildlife Safari",
    primaryDestination: "Chilika",
    type: "Premium",
    variant: "premium",
    duration: "3 Days / 2 Nights",
    groupSize: "4-8 People",
    price: 28000,
    originalPrice: 35000,
    rating: 4.8,
    reviews: 76,
    image: chilikaImage,
    images: [chilikaImage, heroImage],
    locations: ["Chilika", "Satapada"],
    highlights: ["Lakeside Resort", "Boat Safari", "Dolphin Watching", "Bird Watching"],
    description: "Explore Asia's largest brackish water lagoon with dolphins and migratory birds at an affordable price.",
    facilities: ["Lakeside Cottages", "Shared Boat Safari", "All Meals", "Local Guide", "AC Transport"],
    itinerary: [
      { day: 1, title: "Lakeside Arrival", activities: ["Group pickup from Balugaon Station", "Check-in at Panthanivas/Budget Resort", "Evening boat ride to Kalijai Temple", "Group Dinner with local fish curry"] },
      { day: 2, title: "Dolphins & Birds", activities: ["Early morning shared boat safari to Satapada", "Watch Irrawaddy Dolphins playing in the lagoon", "Picnic lunch at Sea Mouth Island", "Visit Nalabana Bird Sanctuary (seasonal)", "Return to resort"] },
      { day: 3, title: "Departure", activities: ["Breakfast", "Visit Narayani Temple en-route", "Drop at Balugaon Railway Station"] },
    ],
    included: ["2 nights in resort", "All meals", "Boat safari", "Guide"],
    excluded: ["Transportation to Chilika", "Personal expenses"],
    hotelDetails: [
       { city: "Chilika", hotel: "Swarajya Resort", nights: 2, type: "Cottage" }
    ],
    foodPlan: "All meals included.",
    pickupDrop: "Pickup/Drop extra.",
  },
  {
    id: 8,
    name: "Luxury Chilika Retreat",
    primaryDestination: "Chilika",
    type: "Elite",
    variant: "elite",
    duration: "4 Days / 3 Nights",
    groupSize: "2-4 People",
    price: 65000,
    originalPrice: 85000,
    rating: 5.0,
    reviews: 42,
    image: chilikaImage,
    images: [chilikaImage, heroImage],
    locations: ["Chilika", "Mangalajodi", "Satapada"],
    highlights: ["Luxury Houseboat", "Private Safari", "Bird Photography", "Gourmet Seafood"],
    description: "Stay in a luxury houseboat or premium resort, enjoy private boat safaris, and experience Chilika like royalty.",
    facilities: ["Luxury Houseboat Stay", "Private Yacht/Boat", "Gourmet Seafood", "Personal Naturalist", "Luxury SUV"],
    itinerary: [
      { day: 1, title: "Luxury on the Lagoon", activities: ["Chauffeur driven pickup in luxury SUV", "Royal Welcome at Swarajya Luxury Houseboat", "Sunset cruise with sparkling wine and canapés", "Candlelight Dinner on the deck under the stars"] },
      { day: 2, title: "Islands & Sanctuaries", activities: ["Private yacht charter for dolphin watching", "Gourmet island picnic lunch", "Exclusive photography session at Mangalajodi wetlands", "Evening cultural performance on the houseboat"] },
      { day: 3, title: "Hidden Gems of Chilika", activities: ["Visit to Rajhans Island and pristine beaches", "Interaction with local fishermen community", "Spa treatment on board or at a luxury resort", "Farewell Gala Dinner"] },
      { day: 4, title: "Departure", activities: ["Champagne Breakfast", "Leisurely check-out", "Luxury transfer to Bhubaneswar Airport"] },
    ],
    included: ["3 nights luxury stay", "All gourmet meals", "Private boat transfers", "Expert naturalist"],
    excluded: ["flights", "personal shopping"],
    hotelDetails: [
       { city: "Chilika", hotel: "Swarajya Luxury Houseboat", nights: 3, type: "Master Suite" }
    ],
    foodPlan: "All meals included (Gourmet)",
    pickupDrop: "Luxury SUV pickup included"
  },
  {
    id: 5,
    name: "Temple Architecture Tour",
    primaryDestination: "Bhubaneswar",
    type: "Pro",
    variant: "pro",
    duration: "4 Days / 3 Nights",
    groupSize: "2-6 People",
    price: 42000,
    originalPrice: 52000,
    rating: 4.9,
    reviews: 92,
    image: lingarajImage,
    images: [lingarajImage, konarkImage, jagannathImage],
    locations: ["Bhubaneswar", "Konark", "Ratnagiri"],
    highlights: ["4-Star Hotels", "Historian Guide", "Private Vehicle", "Breakfast"],
    description: "Deep dive into Kalinga architecture with an expert guide. Perfect for history buffs.",
    facilities: ["4-Star Stay", "Historian Guide", "Private Car", "Daily Breakfast", "Entry Fees"],
    itinerary: [
      { day: 1, title: "Kalinga Architecture 101", activities: ["Arrival and briefing by historian guide", "Sunset visit to Mukteswar Temple (Gem of Odishan Architecture)", "Introduction to Kalinga style lecture", "Dinner at local heritage hotel"] },
      { day: 2, title: "Diamond Triangle of Buddhism", activities: ["Full day excursion to Ratnagiri, Udayagiri, and Lalitgiri", "Explore ancient monasteries and stupas", "Packed lunch at site", "Return to Bhubaneswar for rest"] },
      { day: 3, title: "Shakti & Sun Cults", activities: ["Morning visit to the mystical Chausath Yogini Temple at Hirapur", "Afternoon drive to Konark Sun Temple", "Detailed iconographic study of the temple walls", "Evening return"] },
      { day: 4, title: "Cave Architecture & Departure", activities: ["Morning walk through Udayagiri & Khandagiri Jain caves", "Visit State Museum (time permitting)", "Drop at Airport/Station"] }
    ],
    included: ["3 nights 4-star", "Breakfast", "Guide", "Cab"],
    excluded: ["Lunch/Dinner", "Tips"],
    hotelDetails: [
       { city: "Bhubaneswar", hotel: "Mayfair Convention", nights: 3, type: "Club Room" }
    ],
    foodPlan: "Breakfast included.",
    pickupDrop: "Included from Airport."
  },
  {
    id: 7,
    name: "Bhubaneswar City Break",
    primaryDestination: "Bhubaneswar",
    type: "Premium",
    variant: "premium",
    duration: "3 Days / 2 Nights",
    groupSize: "4-10 People",
    price: 18000,
    originalPrice: 24000,
    rating: 4.4,
    reviews: 35,
    image: lingarajImage,
    images: [lingarajImage, heroImage],
    locations: ["Bhubaneswar", "Nandankanan"],
    highlights: ["City Hotel", "Zoo Visit", "Temple Tour", "Breakfast"],
    description: "A quick and affordable city break to explore the Temple City and Nandankanan Zoo.",
    facilities: ["3-Star Hotel", "AC Transport", "Breakfast", "Sightseeing", "Zoo Entry"],
    itinerary: [
      { day: 1, title: "Temple City Limits", activities: ["Pick up from Station/Airport", "Check-in at City Hotel", "Afternoon visit to Lingaraj Temple and Bindu Sagar Lake", "Evening market stroll at Ekamra Haat"] },
      { day: 2, title: "Wild & Ancient", activities: ["Morning Jungle Safari at Nandankanan Zoological Park", "Visit the White Tiger & Bear safaris", "Post-lunch exploration of Khandagiri Caves", "Relaxing evening at Indira Gandhi Park"] },
      { day: 3, title: "Culture & Departure", activities: ["Breakfast at hotel", "Quick visit to Museum of Tribal Arts and Artifacts", "Shopping for handicrafts", "Drop at Station"] }
    ],
    included: ["2 nights stay", "Breakfast", "Transport", "Tickets"],
    excluded: ["Meals", "Personal"],
    hotelDetails: [
       { city: "Bhubaneswar", hotel: "The Hhi", nights: 2, type: "Standard Room" }
    ],
    foodPlan: "Breakfast included",
    pickupDrop: "Station pickup included"
  },
  {
    id: 10,
    name: "Royal Bhubaneswar Legacy",
    primaryDestination: "Bhubaneswar",
    type: "Elite",
    variant: "elite",
    duration: "4 Days / 3 Nights",
    groupSize: "2-4 People",
    price: 38000,
    originalPrice: 48000,
    rating: 5.0,
    reviews: 22,
    image: lingarajImage,
    images: [lingarajImage, heroImage],
    locations: ["Bhubaneswar", "Dhauli", "Hirapur"],
    highlights: ["Luxury 5-Star Stay", "Private Historian", "Chauffeur Drive", "Spa & Wellness"],
    description: "Experience the Temple City in ultimate luxury with a stay at Mayfair Lagoon, private guided heritage tours, and wellness therapies.",
    facilities: ["5-Star Luxury Resort", "Private Chauffeur", "Historian Guide", "Spa Session", "Gourmet Dining"],
    itinerary: [
      { day: 1, title: "Royal Arrival", activities: ["Luxury Airport pickup", "Check-in at Mayfair Lagoon", "Relax at the lagoon-side", "Gala Dinner with live music"] },
      { day: 2, title: "Heritage & Wellness", activities: ["Private guided tour of Lingaraj & Mukteswar Temples", "Visit Dhauli Peace Pagoda", "Afternoon Ayurveda Spa Session", "Dinner at a fine-dining specialty restaurant"] },
      { day: 3, title: "Mystic Yoginis", activities: ["Excursion to Chausath Yogini Temple", "Visit Kala Bhoomi Museum", "Shopping for luxury handlooms", "Evening cultural performance at the hotel"] },
      { day: 4, title: "Farewell", activities: ["Champagne Breakfast", "Leisure morning", "Luxury drop to Airport"] }
    ],
    included: ["3 Nights Luxury Stay", "Breakfast & Dinner", "Private Transport", "Spa", "Guide"],
    excluded: ["Lunch", "Alcohol", "Tips"],
    hotelDetails: [
       { city: "Bhubaneswar", hotel: "Mayfair Lagoon", nights: 3, type: "Executive Cottage" }
    ],
    foodPlan: "Breakfast & Dinner",
    pickupDrop: "Luxury SUV from Airport"
  },

  {
    id: 9,
    name: "Chilika Eco-Resort Stay",
    primaryDestination: "Chilika",
    type: "Pro",
    variant: "pro",
    duration: "3 Days / 2 Nights",
    groupSize: "2-6 People",
    price: 36000,
    originalPrice: 45000,
    rating: 4.7,
    reviews: 55,
    image: chilikaImage,
    images: [chilikaImage, heroImage],
    locations: ["Chilika", "Satapada", "Barkul"],
    highlights: ["Eco-Resort", "Private Boat", "Bonfire", "Seafood Platter"],
    description: "Immerse yourself in nature with a stay at a premium eco-resort on an island, featuring private boat trips and campfire evenings.",
    facilities: ["Bamboo Cottage AC", "Private Boat Ride", "Campfire & BBQ", "Expert Bird Guide", "AC Innova"],
    itinerary: [
      { day: 1, title: "Eco-Island Escape", activities: ["Transfer to Satapada", "Boat ride to the secluded Eco-Resort Island", "Check-in to bamboo cottages", "Sunset kayaking experience", "Bonfire evening with BBQ"] },
      { day: 2, title: "The Blue Lagoon", activities: ["Morning nature walk on the island", "Private boat safari to spot Dolphins", "Visit red crab habitat", "Traditional Odia seafood lunch", "Evening stargazing session"] },
      { day: 3, title: "Nature's Goodbye", activities: ["Sunrise Yoga by the lake", "Hearty breakfast", "Boat transfer to mainland", "Drop at Puri/Bhubaneswar"] },
    ],
    included: ["2 nights island resort", "All meals", "Private transfers", "Guide"],
    excluded: ["Personal beverages", "Tips"],
    hotelDetails: [
       { city: "Chilika", hotel: "Eco-Cottage Island Resort", nights: 2, type: "Lagoon View Cottage" }
    ],
    foodPlan: "Breakfast, Lunch, Dinner included",
    pickupDrop: "Included from Puri/Bhubaneswar"
  },

  {
    id: 11,
    name: "Konark Sun Glory",
    primaryDestination: "Konark",
    type: "Pro",
    variant: "pro",
    duration: "2 Days / 1 Night",
    groupSize: "2-8 People",
    price: 15000,
    originalPrice: 20000,
    rating: 4.8,
    reviews: 60,
    image: konarkImage,
    images: [konarkImage, heroImage],
    locations: ["Konark", "Chandrabhaga"],
    highlights: ["Sun Temple", "Light & Sound Show", "Beach Glamping", "Surfing"],
    description: "Witness the grandeur of the Sun Temple and experience luxury glamping at Chandrabhaga beach.",
    facilities: ["luxury Glamping Tent", "Private Tour Guide", "Bonfire Dinner", "Surfing Lessons", "AC Transport"],
    itinerary: [
      { day: 1, title: "Sun Temple & Glamping", activities: ["Arrival", "Sun Temple Tour", "Light & Sound Show", "Beach Glamping check-in"] },
      { day: 2, title: "Sunrise & Surf", activities: ["Sunrise at Chandrabhaga", "Surfing session", "Marine Drive", "Departure"] }
    ],
    included: ["1 night glamping", "Breakfast & Dinner", "Guide", "Entry fees"],
    excluded: ["Lunch", "Personal expenses"],
    hotelDetails: [
       { city: "Konark", hotel: "Eco Retreat Konark", nights: 1, type: "Luxury Tent" }
    ],
    foodPlan: "Breakfast & Dinner",
    pickupDrop: "From Puri/Bhubaneswar"
  },
  {
    id: 12,
    name: "Konark Budget Trip",
    primaryDestination: "Konark",
    type: "Premium",
    variant: "premium",
    duration: "1 Day / 0 Nights",
    groupSize: "4-15 People",
    price: 3500,
    originalPrice: 5000,
    rating: 4.3,
    reviews: 120,
    image: konarkImage,
    images: [konarkImage],
    locations: ["Konark", "Ramchandi"],
    highlights: ["Day Trip", "Bus Travel", "Guide", "Lunch"],
    description: "A quick and pocket-friendly day trip to the Black Pagoda with group activities.",
    facilities: ["AC Bus", "Group Guide", "Odia Thali Lunch", "Water Bottle", "Assistance"],
    itinerary: [
      { day: 1, title: "Konark Day Tour", activities: ["Pickup", "Sun Temple", "Ramchandi Beach", "Lunch", "Drop"] }
    ],
    included: ["AC Transport", "Lunch", "Guide"],
    excluded: ["Entry tickets", "Breakfast/Dinner"],
    hotelDetails: [],
    foodPlan: "Lunch included",
    pickupDrop: "Designated pickup points"
  },
  {
    id: 13,
    name: "Gopalpur Beach Serenity",
    primaryDestination: "Gopalpur",
    type: "Pro",
    variant: "pro",
    duration: "3 Days / 2 Nights",
    groupSize: "2-6 People",
    price: 22000,
    originalPrice: 28000,
    rating: 4.6,
    reviews: 45,
    image: heroImage,
    images: [heroImage, chilikaImage],
    locations: ["Gopalpur", "Berhampur", "Tampara"],
    highlights: ["Beach Resort", "Water Sports", "Lighthouse", "Relaxation"],
    description: "Unwind at the colonial beach town of Gopalpur-on-Sea. Perfect for a relaxing weekend getaway.",
    facilities: ["Sea View Room", "AC Car", "Breakfast", "Tampara Lake Boating", "Lighthouse Visit"],
    itinerary: [
      { day: 1, title: "Coastal Charm", activities: ["Scenic drive to Gopalpur-on-Sea", "Check-in at a Sea-facing resort", "Evening stroll on the historic beach", "Dinner featuring fresh catch of the day"] },
      { day: 2, title: "Lakes & Lighthouses", activities: ["Morning visit to the colonial Lighthouse", "Excursion to Tampara Lake for water sports", "Visit Potagarh Fort ruins", "Relaxing evening by the waves"] },
      { day: 3, title: "Departure", activities: ["Breakfast with sea view", "Shopping for Berhampur Silk Sarees", "Transfer to Railway Station"] }
    ],
    included: ["2 nights stay", "Breakfast", "Transport", "Boating"],
    excluded: ["Camel ride", "Lunch/Dinner"],
    hotelDetails: [
       { city: "Gopalpur", hotel: "Mayfair Palm Beach", nights: 2, type: "Executive Room" }
    ],
    foodPlan: "Breakfast included",
    pickupDrop: "From Berhampur Station"
  },
  {
    id: 14,
    name: "Similipal Tiger Trail",
    primaryDestination: "Similipal",
    type: "Elite",
    variant: "elite",
    duration: "4 Days / 3 Nights",
    groupSize: "2-6 People",
    price: 45000,
    originalPrice: 55000,
    rating: 4.7,
    reviews: 30,
    image: chilikaImage,
    images: [chilikaImage, heroImage], 
    locations: ["Similipal", "Baripada"],
    highlights: ["Jungle Safari", "Waterfall", "Nature Camp", "Tribal Food"],
    description: "Venture deep into the Biosphere Reserve. Spot elephants, waterfalls, and if lucky, the Royal Bengal Tiger.",
    facilities: ["Luxury Eco-Cottage", "Private 4x4 Safari", "Naturalist", "Tribal Dance", "All Meals"],
    itinerary: [
      { day: 1, title: "Into the Tiger's Den", activities: ["Luxury SUV pickup from Balasore", "Check-in at premium cottage in Lulung/Jamuani", "Guided Nature Walk", "Tribal dance performance by campfire"] },
      { day: 2, title: "The Grand Safari", activities: ["Exclusive 4x4 Jeep Safari to core area", "Visit magnificent Barehipani & Joranda Waterfalls", "Jungle picnic lunch", "Wildlife tracking with senior naturalist", "Evening wildlife film screening"] },
      { day: 3, title: "Culture & Crocodiles", activities: ["Visit to a tribal village for cultural immersion", "Traditional tribal lunch", "Visit Ramtirtha Crocodile Project", "Rest and relaxation amidst nature"] },
      { day: 4, title: "Departure", activities: ["Breakfast with birdwatching", "Visit local handicraft center", "Drop to Station"] }
    ],
    included: ["3 nights Eco-stay", "All Meals", "2 Safaris", "Permits"],
    excluded: ["Camera fees", "Personal gear"],
    hotelDetails: [
       { city: "Similipal", hotel: "Lulung Aranya Niwas", nights: 3, type: "Premium Cottage" }
    ],
    foodPlan: "All meals included",
    pickupDrop: "From Balasore Station"
  },
  {
    id: 15,
    name: "Konark Royal Heritage",
    primaryDestination: "Konark",
    type: "Elite",
    variant: "elite",
    duration: "3 Days / 2 Nights",
    groupSize: "2-4 People",
    price: 42000,
    originalPrice: 55000,
    rating: 4.9,
    reviews: 25,
    image: konarkImage,
    images: [konarkImage, heroImage],
    locations: ["Konark", "Marine Drive", "Kuruma"],
    highlights: ["Luxury Glamping Suite", "Exclusive Sun Temple Tour", "Yacht Ride", "Fine Dining"],
    description: "Experience the Sun Temple like royalty with a stay in premium glamping suites and curated cultural experiences.",
    facilities: ["Royal Suite Glamping", "Private Chauffeur", "Gala Dinner", "Spa Session", "VIP Temple Entry"],
    itinerary: [
      { day: 1, title: "Royal Konark Arrival", activities: ["Chauffeur driven entry to Konark", "VIP Check-in at Presidential Suite", "Private sunset yacht ride at Ramchandi Mouth", "Exclusive Gala Dinner under the stars"] },
      { day: 2, title: "Legends of Stone", activities: ["Private Scholar-led tour of the Sun Temple", "Visit to Kuruma Buddhist archaeological site", "Afternoon high tea by the beach", "Private Odissi Dance performance", "Beachside BBQ"] },
      { day: 3, title: "Wellness & Departure", activities: ["Morning Sunrise Yoga session", "Rejuvenating Ayurveda Spa treatment", "Gourmet Breakfast", "Luxury transfer to Airport"] }
    ],
    included: ["2 Nights Luxury Stay", "All Meals", "Private Transport", "Spa", "Guide"],
    excluded: ["Personal shopping", "Tips"],
    hotelDetails: [
       { city: "Konark", hotel: "Eco Retreat Presidential Suite", nights: 2, type: "Royal Suite" }
    ],
    foodPlan: "All Meals + High Tea",
    pickupDrop: "Luxury SUV from Airport"
  },
  {
    id: 16,
    name: "Gopalpur Luxury Retreat",
    primaryDestination: "Gopalpur",
    type: "Elite",
    variant: "elite",
    duration: "4 Days / 3 Nights",
    groupSize: "2-4 People",
    price: 55000,
    originalPrice: 70000,
    rating: 4.9,
    reviews: 18,
    image: heroImage,
    images: [heroImage, chilikaImage],
    locations: ["Gopalpur", "Rambha", "Taptapani"],
    highlights: ["Mayfair Palm Beach Stay", "Private Beach Access", "Hot Springs", "Sunset Cruise"],
    description: "Indulge in colonial luxury at the historic Mayfair Palm Beach Resort with exclusive excursions to Chilika and hot springs.",
    facilities: ["Pool Villa/Suite", "Private Butler", "Candlelight Dinner", "Couple Spa", "Luxury Transport"],
    itinerary: [
      { day: 1, title: "Colonial Luxury", activities: ["Luxury sedan pickup", "Traditional welcome at Mayfair Palm Beach Resort", "Private balcony tea session overlooking the sea", "Candlelight Dinner by the pool"] },
      { day: 2, title: "Exploring the Lagoon", activities: ["Day trip to Chilika (Rambha sector)", "Private boat to Breakfast Island", "Visit the Beacon Island and Honeymoon Island", "Return for a spa evening"] },
      { day: 3, title: "Springs & Silk", activities: ["Morning drive to Taptapani Hot Springs", "Lunch at a hill-view restaurant", "Private viewing of Berhampuri Pata Silk weaving", "Gala Farewell Dinner"] },
      { day: 4, title: "Departure", activities: ["Champagne Breakfast", "Lighthouse photography session", "Luxury drop to Bhubaneswar"] }
    ],
    included: ["3 Nights 5-Star Stay", "Breakfast & Dinner", "Transport", "Spa", "Cruise"],
    excluded: ["Lunch", "Alcohol"],
    hotelDetails: [
       { city: "Gopalpur", hotel: "Mayfair Palm Beach Resort", nights: 3, type: "Premium Suite" }
    ],
    foodPlan: "Breakfast & Dinner",
    pickupDrop: "Luxury Sedan from Bhubaneswar"
  },
  {
    id: 17,
    name: "Gopalpur Weekend Fun",
    primaryDestination: "Gopalpur",
    type: "Premium",
    variant: "premium",
    duration: "2 Days / 1 Night",
    groupSize: "4-10 People",
    price: 6500,
    originalPrice: 8500,
    rating: 4.4,
    reviews: 85,
    image: heroImage, 
    images: [heroImage],
    locations: ["Gopalpur", "Berhampur"],
    highlights: ["Beach Fun", "Street Food", "Budget Stay", "Shopping"],
    description: "A pocket-friendly weekend trip to enjoy the waves and famous Berhampur street food.",
    facilities: ["Standard AC Room", "Shared Transport", "Breakfast", "Guide Assistance", "Beach Games"],
    itinerary: [
      { day: 1, title: "Beach Fun", activities: ["Pickup from Berhampur Station", "Check-in at budget hotel near beach", "Evening street food trail (Pickles & Bombai Laddoos)", "Beach games and fun"] },
      { day: 2, title: "Sunrise & Shop", activities: ["Early morning sunrise view", "Local market visit for souvenirs", "Drop at Station"] }
    ],
    included: ["1 Night Stay", "Breakfast", "Station Transfer"],
    excluded: ["Lunch/Dinner", "Entry fees"],
    hotelDetails: [
       { city: "Gopalpur", hotel: "Sea Pearl / Similar", nights: 1, type: "Standard Room" }
    ],
    foodPlan: "Breakfast only",
    pickupDrop: "From Berhampur Station"
  },
  {
    id: 18,
    name: "Similipal Adventure Camp",
    primaryDestination: "Similipal",
    type: "Pro",
    variant: "pro",
    duration: "3 Days / 2 Nights",
    groupSize: "4-8 People",
    price: 18000,
    originalPrice: 24000,
    rating: 4.5,
    reviews: 50,
    image: chilikaImage,
    images: [chilikaImage],
    locations: ["Similipal", "Chahala"],
    highlights: ["Nature Camp", "Jungle Trek", "Wildlife Spotting", "Bonfire"],
    description: "Stay in government nature camps and explore the core areas of the tiger reserve.",
    facilities: ["Bamboo Cottage", "Gypsy Safari", "Forest Guide", "Odia Meals", "Trekking"],
    itinerary: [
      { day: 1, title: "Wilderness Calling", activities: ["Pickup and transfer to Similipal Nature Camp", "Check-in to Eco-Cottages", "Evening forest trek with guide", "Dinner under canopy"] },
      { day: 2, title: "Safari Expedition", activities: ["Morning Safari to Chahala range", "Spotting herds of elephants and deer", "Visit to Uski Waterfall", "Evening campfire and interaction with forest guards"] },
      { day: 3, title: "Departure", activities: ["Breakfast", "Short visit to Mugger Crocodile breeding center", "Drop at Balasore/Baripada"] }
    ],
    included: ["2 Nights Camp Stay", "All Meals", "1 Safari", "Entry Fees"],
    excluded: ["Extra Safari", "Personal expenses"],
    hotelDetails: [
       { city: "Similipal", hotel: "OFDC Nature Camp", nights: 2, type: "Cottage" }
    ],
    foodPlan: "All Meals",
    pickupDrop: "From Baripada/Balasore"
  },
  {
    id: 19,
    name: "Similipal Nature Day",
    primaryDestination: "Similipal",
    type: "Premium",
    variant: "premium",
    duration: "1 Day / 0 Nights",
    groupSize: "6-15 People",
    price: 4500,
    originalPrice: 6000,
    rating: 4.2,
    reviews: 40,
    image: chilikaImage,
    images: [chilikaImage],
    locations: ["Similipal"],
    highlights: ["Day Safari", "Waterfalls", "Picnic", "Group Tour"],
    description: "A thrilling day excursion into Similipal National Park with a group safari experience.",
    facilities: ["AC Bus/Traveller", "Entry Permit", "Packed Lunch", "Guide", "Water"],
    itinerary: [
      { day: 1, title: "Jungle Day Out", activities: ["Early morning pickup", "Entry permit formalities at Pithabata", "Safari drive to Joranda Waterfall", "Packed lunch amidst nature", "Visit Chahala animal sighting point", "Return by evening"] }
    ],
    included: ["Transport", "Lunch", "Permits"],
    excluded: ["Breakfast/Dinner", "Camera View"],
    hotelDetails: [],
    foodPlan: "Packed Lunch",
    pickupDrop: "From Baripada"
  }
];
