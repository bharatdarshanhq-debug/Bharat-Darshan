/**
 * One-time migration script to backfill bookingNumber for existing bookings
 * and initialize the counter.
 * 
 * Run with: node scripts/backfillBookingNumbers.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const Booking = require('../models/Booking');

const backfill = async () => {
  try {
    await connectDB();

    // Get all bookings without bookingNumber, sorted by creation date
    const bookings = await Booking.find({ bookingNumber: { $exists: false } })
      .sort({ createdAt: 1 });

    if (bookings.length === 0) {
      console.log('No bookings need backfilling.');
      process.exit(0);
    }

    console.log(`Found ${bookings.length} bookings to backfill...`);

    // Find the current highest bookingNumber
    const highest = await Booking.findOne({ bookingNumber: { $exists: true } })
      .sort({ bookingNumber: -1 });
    
    let nextNumber = highest ? highest.bookingNumber + 1 : 1;

    for (const booking of bookings) {
      await Booking.updateOne(
        { _id: booking._id },
        { $set: { bookingNumber: nextNumber } }
      );
      console.log(`  ${booking._id} → TUR${String(nextNumber).padStart(3, '0')}`);
      nextNumber++;
    }

    // Update the counter document
    const Counter = mongoose.models.Counter || mongoose.model('Counter', new mongoose.Schema({
      _id: { type: String },
      seq: { type: Number },
    }));

    await Counter.findByIdAndUpdate(
      'bookingNumber',
      { $set: { seq: nextNumber - 1 } },
      { upsert: true, new: true }
    );

    console.log(`\nDone! Counter set to ${nextNumber - 1}. Next booking will be TUR${String(nextNumber).padStart(3, '0')}.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during backfill:', error);
    process.exit(1);
  }
};

backfill();
