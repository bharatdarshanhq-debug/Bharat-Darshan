const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    packageId: {
      type: String, 
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
    packageImage: {
      type: String,
      required: true,
    },
    travelers: {
      type: Number,
      required: true,
      default: 1,
    },
    bookingDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    tripDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    contactPhone: {
        type: String,
    },
    specialRequests: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
