const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'State name is required'],
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
      required: [true, 'State image is required'],
    },
    description: {
      type: String,
      default: '',
    },
    slogan: {
      type: String,
      default: '',
    },
    destinationsCount: {
      type: Number,
      default: 0,
    },
    packagesCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isComingSoon: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create slug from name before saving
stateSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

// Index for faster queries
stateSchema.index({ isActive: 1, order: 1 });
stateSchema.index({ isComingSoon: 1 });

module.exports = mongoose.model('State', stateSchema);
