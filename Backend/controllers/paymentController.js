const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

// Initialize Razorpay only if credentials are available
// Initialize Razorpay only if credentials are available
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log('✅ Razorpay initialized successfully');
  } catch (err) {
    console.error('❌ Razorpay initialization failed:', err.message);
  }
} else {
  console.log('⚠️  Razorpay not initialized - set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
}

/**
 * @desc    Create Razorpay order
 * @route   POST /api/payments/create-order
 * @access  Protected
 */
const createOrder = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'Payment gateway not configured. Please set up Razorpay credentials.',
        demo: true,
      });
    }

    const { amount, bookingId, currency = 'INR' } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        error: 'Amount is required',
      });
    }

    // Amount should be in paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency,
      receipt: `booking_${bookingId || Date.now()}`,
      notes: {
        bookingId: bookingId || '',
        userId: req.user._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    // If bookingId provided, update booking with order ID
    if (bookingId) {
      await Booking.findByIdAndUpdate(bookingId, {
        orderId: order.id,
      });
    }

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create order',
    });
  }
};

/**
 * @desc    Verify Razorpay payment
 * @route   POST /api/payments/verify
 * @access  Protected
 */
const verifyPayment = async (req, res) => {
  try {
    // Check if Razorpay is initialized
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        error: 'Payment gateway not configured. Please set up Razorpay credentials.',
        demo: true,
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing payment details',
      });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed - Invalid signature',
      });
    }

    // Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    // Update booking with payment details
    if (bookingId) {
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        {
          paymentId: razorpay_payment_id,
          paymentStatus: 'paid',
          status: 'confirmed',
          paymentMethod: payment.method || 'razorpay',
          paymentDetails: {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            method: payment.method,
            bank: payment.bank,
            wallet: payment.wallet,
            vpa: payment.vpa,
            email: payment.email,
            contact: payment.contact,
            fee: payment.fee,
            tax: payment.tax,
            captured: payment.captured,
            created_at: payment.created_at,
          },
        },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Payment verified successfully',
        booking,
      });
    } else {
      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          method: payment.method,
        },
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Payment verification failed',
    });
  }
};

/**
 * @desc    Get payment status for a booking
 * @route   GET /api/payments/:bookingId
 * @access  Protected
 */
const getPaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
    }

    res.json({
      success: true,
      payment: {
        status: booking.paymentStatus,
        paymentId: booking.paymentId,
        orderId: booking.orderId,
        method: booking.paymentMethod,
      },
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch payment status',
    });
  }
};

/**
 * @desc    Get Razorpay key for frontend
 * @route   GET /api/payments/key
 * @access  Public
 */
const getRazorpayKey = async (req, res) => {
  res.json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID,
  });
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentStatus,
  getRazorpayKey,
};
