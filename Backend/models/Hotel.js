const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination/City is required'], // e.g., "Puri", "Bhubaneswar"
      trim: true,
      index: true
    },
    location: {
      type: String,
      required: [true, 'Specific location/address is required'],
    },
    packageType: [{
      type: String,
      enum: ['Elite', 'Pro', 'Premium'],
      required: true,
    }],
    images: [{
      type: String, // URL to image
    }],
    amenities: [{
      type: String,
    }],
    description: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Indexes for faster filtering during selection
hotelSchema.index({ destination: 1, packageType: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);
