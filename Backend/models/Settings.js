const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  notifications: {
    emailBookings: { type: Boolean, default: true },
    emailInquiries: { type: Boolean, default: true },
    emailPayments: { type: Boolean, default: false },
    browserNotifications: { type: Boolean, default: true },
  },
  security: {
    twoFactor: { type: Boolean, default: false },
    sessionTimeout: { type: Boolean, default: true },
  },
  website: {
    maintenance: { type: Boolean, default: false },
    showPrices: { type: Boolean, default: true },
    bookingEnabled: { type: Boolean, default: true },
  },
  payments: {
    razorpay: { type: Boolean, default: true },
    testMode: { type: Boolean, default: false },
  },
}, { timestamps: true });

// Prevent multiple settings documents
settingsSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Settings').countDocuments();
    if (count > 0) {
      throw new Error('Cannot create more than one Settings document');
    }
  }
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
