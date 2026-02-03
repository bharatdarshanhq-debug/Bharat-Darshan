const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'Destination image is required'],
    },
    description: {
      type: String,
      default: '',
    },
    // Additional fields for Admin dashboard
    tags: {
      type: [String],
      default: [],
    },
    tagline: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    bestTime: {
      type: String,
      default: '',
    },
    mustVisit: {
      type: [String],
      default: [],
    },
    travelTips: {
      type: [String],
      default: [],
    },
    packagesCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'State',
    },
    stateName: {
      type: String,
      default: 'Odisha',
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
destinationSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

// Index for faster queries (slug already indexed via unique: true)
destinationSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('Destination', destinationSchema);
