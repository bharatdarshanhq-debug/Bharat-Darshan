/**
 * Seed script to insert 50 random Puri-related inquiries into the Contact collection.
 * Location distribution: 70% Kolkata, 20% Odisha, 10% Other
 * Run: node scripts/seedInquiries.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Contact = require('../models/Contact');

// ─── Data pools ─────────────────────────────────────────────────

// Puri packages — must match actual packages in the database (by tier)
const puriPackages = [
  // Lite tier
  { name: 'Puri Lite Darshan Package', tier: 'Lite' },
  // Standard tier
  { name: 'Puri Standard Package', tier: 'Standard' },
  // Pro tier
  { name: 'Spiritual Puri Yatra', tier: 'Pro' },
  // Premium tier
  { name: 'Puri Beach Fun', tier: 'Premium' },
  // Elite tier
  { name: 'Royal Puri Luxury', tier: 'Elite' },
  { name: 'Puri Elite Customized Package', tier: 'Elite' },
  // General (no specific package)
  { name: 'General Inquiry', tier: null },
];

// ─── Location-based name pools ──────────────────────────────────

// Odisha names (50%)
const odishaFirstNames = [
  'Biswajit', 'Subhashree', 'Pradeep', 'Smruti', 'Debashish', 'Lipsa',
  'Somanath', 'Barsha', 'Jyoti', 'Sasmita', 'Rajesh', 'Madhusmita',
  'Bikash', 'Monalisa', 'Sunil', 'Anuradha', 'Manoj', 'Suchismita',
  'Tapan', 'Itishree', 'Anil', 'Sangita', 'Dilip', 'Sunita',
  'Ashok', 'Mamata', 'Ranjan', 'Jayanti', 'Niranjan', 'Sanjukta',
];
const odishaLastNames = [
  'Patra', 'Sahoo', 'Mohanty', 'Nayak', 'Behera', 'Jena', 'Pradhan',
  'Swain', 'Mishra', 'Dash', 'Sethi', 'Sahu', 'Parida', 'Samantaray',
  'Barik', 'Routray', 'Rout', 'Mohapatra', 'Das', 'Lenka',
];
const odishaCities = [
  'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur',
  'Balasore', 'Baripada', 'Angul', 'Jharsuguda', 'Puri',
];

// Kolkata names (35%)
const kolkataFirstNames = [
  'Sourav', 'Rituparna', 'Aniket', 'Moumita', 'Arnab', 'Sayani',
  'Subrata', 'Tanushree', 'Debojyoti', 'Arpita', 'Prosenjit', 'Swastika',
  'Abhijit', 'Raima', 'Partha', 'Payel', 'Suman', 'Rupa',
  'Kaushik', 'Indrani', 'Dipankar', 'Sreelekha', 'Anirban', 'Poulami',
];
const kolkataLastNames = [
  'Banerjee', 'Chatterjee', 'Mukherjee', 'Ghosh', 'Bose', 'Roy',
  'Sen', 'Dutta', 'Mitra', 'Dasgupta', 'Chakraborty', 'Bhattacharya',
  'Ganguly', 'Sarkar', 'Majumdar', 'De', 'Kundu', 'Saha',
];
const kolkataAreas = [
  'Salt Lake', 'New Town', 'Howrah', 'Dum Dum', 'Jadavpur',
  'Ballygunge', 'Behala', 'Baranagar', 'Tollygunge', 'Park Street',
];

// Other-location names (15%)
const otherFirstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Ananya', 'Diya', 'Myra',
  'Priya', 'Neha', 'Rohan', 'Karan', 'Amit', 'Rahul',
  'Simran', 'Payal', 'Vikram', 'Deepak',
];
const otherLastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Patel', 'Reddy',
  'Joshi', 'Agarwal', 'Kapoor', 'Malhotra', 'Bhatia', 'Thakur', 'Saxena',
];
const otherCities = [
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai',
  'Pune', 'Jaipur', 'Lucknow', 'Ahmedabad', 'Chandigarh',
  'Patna', 'Ranchi', 'Nagpur', 'Indore',
];

const emailDomains = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'rediffmail.com',
  'protonmail.com', 'icloud.com', 'mail.com',
];

const statuses = ['New', 'Contacted', 'Resolved'];

// ─── Puri-specific message templates ────────────────────────────
const messageTemplates = [
  'Hi, I am interested in the {package} package. Could you please share the itinerary and pricing details for Puri?',
  'I would like to plan a trip to Puri for {travelers} people from {city}. Please share available dates and costs.',
  'We are a group of {travelers} from {city} looking to visit Jagannath Temple in Puri. Can you customize a package?',
  'I saw your {package} online and would love to know more. When is the best time to visit Puri?',
  'Hello! I want to book a trip to Puri for my family of {travelers} from {city}. What are the available options?',
  'Can you provide details about accommodation near Puri beach for the {package}?',
  'I am planning a spiritual trip to Puri and Jagannath Temple. Do you offer any special pilgrimage packages?',
  'We are {travelers} people from {city} interested in a 3-day Puri trip. Please send a detailed quote.',
  'I would like to know about group discounts for the {package} for {travelers} travelers from {city}.',
  'Hi, I need help planning a trip to Puri from {city}. What would you recommend?',
  'Looking for a budget-friendly package to Puri from {city}. Can you suggest something under ₹10,000 per person?',
  'I want to surprise my parents with a trip to Puri from {city}. Can you help plan something special?',
  'Is the {package} available in March? We are {travelers} people from {city} and want to finalize soon.',
  'Do you arrange transport from {city} to Puri? We are a family of {travelers}.',
  'I recently visited Puri with your company and had an amazing experience. I\'d like to book another trip for family!',
  'Can I get a customized itinerary for Puri that includes Konark Sun Temple and Chilika Lake for {travelers} people?',
  'Hi, what are the cancellation and refund policies for the {package}?',
  'I want to visit Puri during Rath Yatra. Do you have special arrangements for {travelers} people from {city}?',
  'Please share the food and accommodation details for the Puri tour. We need pure vegetarian options for {travelers} people.',
  'I have a group of senior citizens ({travelers} people) from {city}. Do you have comfortable packages to Puri?',
  'We want to celebrate our anniversary at a beachside resort in Puri. Any luxury packages available?',
  'What safety measures do you take during beach activities in Puri?',
  'Can you arrange a corporate retreat for {travelers} employees from {city} to Puri?',
  'I want to explore the heritage sites around Puri – Konark, Dhauli, Udayagiri. Which package covers all?',
  'Do you offer student discounts for the {package}?',
  'I\'m interested in photography tours covering Puri beach sunrise and Konark. Do you have specialized packages?',
  'We\'re planning a religious pilgrimage to Jagannath Puri for {travelers} devotees from {city}. Can you help?',
  'What documents and things should I carry for the Puri trip? First time visiting from {city}.',
  'Can I extend the {package} by 2 more days to explore Chilika Lake as well?',
  'Is it possible to combine the Puri tour with a visit to Bhubaneswar and Konark? We are {travelers} from {city}.',
];

// ─── Helpers ────────────────────────────────────────────────────
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function generatePhone(region) {
  const prefixes = {
    odisha: ['94', '93', '91', '76', '78', '63', '87'],
    kolkata: ['98', '97', '90', '83', '70', '62', '86'],
    other: ['95', '96', '88', '85', '73', '74', '75', '79'],
  };
  const prefix = pick(prefixes[region] || prefixes.other);
  return `+91 ${prefix}${String(randInt(10000000, 99999999))}`;
}

function generateEmail(firstName, lastName) {
  const separators = ['.', '_', ''];
  const sep = pick(separators);
  const num = Math.random() > 0.5 ? randInt(1, 999) : '';
  return `${firstName.toLowerCase()}${sep}${lastName.toLowerCase()}${num}@${pick(emailDomains)}`;
}

function generateMessage(packageName, city) {
  const template = pick(messageTemplates);
  const travelers = randInt(2, 12);
  return template
    .replace(/\{package\}/g, packageName)
    .replace(/\{city\}/g, city)
    .replace(/\{travelers\}/g, String(travelers));
}

// Tier distribution weights for inquiries
// More inquiries for popular mid-range tiers
function pickPackage() {
  const roll = Math.random();
  if (roll < 0.20) return puriPackages.find(p => p.tier === 'Lite');
  if (roll < 0.40) return puriPackages.find(p => p.tier === 'Standard');
  if (roll < 0.60) return puriPackages.find(p => p.tier === 'Pro');
  if (roll < 0.75) return puriPackages.find(p => p.tier === 'Premium');
  if (roll < 0.88) {
    const elites = puriPackages.filter(p => p.tier === 'Elite');
    return pick(elites);
  }
  return puriPackages.find(p => p.tier === null); // General Inquiry
}

function randomDate(daysBack) {
  const now = Date.now();
  const offset = Math.floor(Math.random() * daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - offset);
}

// ─── Generate a single inquiry based on region ──────────────────
function generateInquiry(region) {
  let firstName, lastName, city;

  if (region === 'odisha') {
    firstName = pick(odishaFirstNames);
    lastName = pick(odishaLastNames);
    city = pick(odishaCities);
  } else if (region === 'kolkata') {
    firstName = pick(kolkataFirstNames);
    lastName = pick(kolkataLastNames);
    city = `Kolkata (${pick(kolkataAreas)})`;
  } else {
    firstName = pick(otherFirstNames);
    lastName = pick(otherLastNames);
    city = pick(otherCities);
  }

  const pkg = pickPackage();
  const packageName = pkg.name;

  // Weight statuses: ~50% New, ~30% Contacted, ~20% Resolved
  let status;
  const roll = Math.random();
  if (roll < 0.5) status = 'New';
  else if (roll < 0.8) status = 'Contacted';
  else status = 'Resolved';

  return {
    name: `${firstName} ${lastName}`,
    email: generateEmail(firstName, lastName),
    phone: generatePhone(region),
    message: generateMessage(packageName, city),
    package: packageName,
    destination: 'Puri',
    status,
    createdAt: randomDate(90),
  };
}

// ─── Generate all inquiries with location distribution ──────────
function generateInquiries(count) {
  const inquiries = [];
  const kolkataCount = Math.round(count * 0.70);    // 70%
  const odishaCount = Math.round(count * 0.20);     // 20%
  const otherCount = count - kolkataCount - odishaCount; // 10%

  for (let i = 0; i < kolkataCount; i++) inquiries.push(generateInquiry('kolkata'));
  for (let i = 0; i < odishaCount; i++) inquiries.push(generateInquiry('odisha'));
  for (let i = 0; i < otherCount; i++) inquiries.push(generateInquiry('other'));

  // Shuffle so they aren't grouped by region
  for (let i = inquiries.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [inquiries[i], inquiries[j]] = [inquiries[j], inquiries[i]];
  }

  return inquiries;
}

// ─── Main ───────────────────────────────────────────────────────
async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!\n');

    // Clear old inquiries first
    const deleted = await Contact.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing inquiries.\n`);

    const INQUIRY_COUNT = 50;
    const inquiries = generateInquiries(INQUIRY_COUNT);

    console.log(`Inserting ${INQUIRY_COUNT} Puri-related inquiries...`);
    console.log(`  → Kolkata: ${Math.round(INQUIRY_COUNT * 0.70)} | Odisha: ${Math.round(INQUIRY_COUNT * 0.20)} | Other: ${INQUIRY_COUNT - Math.round(INQUIRY_COUNT * 0.70) - Math.round(INQUIRY_COUNT * 0.20)}\n`);

    const result = await Contact.insertMany(inquiries);
    console.log(`✅ Successfully inserted ${result.length} inquiries.\n`);

    // Summary
    const newCount = result.filter(r => r.status === 'New').length;
    const contactedCount = result.filter(r => r.status === 'Contacted').length;
    const resolvedCount = result.filter(r => r.status === 'Resolved').length;
    console.log(`   New:       ${newCount}`);
    console.log(`   Contacted: ${contactedCount}`);
    console.log(`   Resolved:  ${resolvedCount}`);

    await mongoose.disconnect();
    console.log('\nDone! Disconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
