const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // required: true, // Made optional for manual bookings
    },
    contactName: {
      type: String,
    },
    contactEmail: {
      type: String,
    },
    packageId: {
      type: String, 
      required: true,
    },
    packageName: {
      type: String,
      required: true,
    },
    destination: {
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
    // Payment Gateway Fields
    paymentId: {
      type: String,
      default: null,
    },
    orderId: {
      type: String,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'upi', 'card', 'netbanking', 'wallet', null],
      default: null,
    },
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    // Pricing Details
    basePrice: {
      type: Number,
    },
    gstAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    // Hotel Selection
    selectedHotels: [{
      city: { type: String, required: true },
      hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
      hotelName: { type: String, required: true },
    }],
    isReadByAdmin: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
