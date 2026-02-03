const express = require('express');
const router = express.Router();

const {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  getRazorpayKey,
} = require('../controllers/paymentController');

const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/payments/key
// @desc    Get Razorpay public key
// @access  Public
router.get('/key', getRazorpayKey);

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Protected
router.post('/create-order', protect, createOrder);

// @route   POST /api/payments/verify
// @desc    Verify Razorpay payment
// @access  Protected
router.post('/verify', protect, verifyPayment);

// @route   GET /api/payments/:bookingId
// @desc    Get payment status for booking
// @access  Protected
router.get('/:bookingId', protect, getPaymentStatus);

module.exports = router;
