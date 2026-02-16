const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingHotels,
  updateBookingStatus,
  getRefundPreview,
  requestCancellation,
  approveCancellation,
  rejectCancellation,
  deleteBooking,
} = require('../controllers/bookingController');
const { processRefund } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, getBookings);

router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, deleteBooking);

router.route('/:id/hotels')
  .put(protect, updateBookingHotels);

router.route('/:id/status')
  .put(protect, updateBookingStatus);

// Cancellation & Refund routes
router.get('/:id/refund-preview', protect, getRefundPreview);
router.put('/:id/request-cancel', protect, requestCancellation);
router.put('/:id/approve-cancel', protect, approveCancellation);
router.put('/:id/reject-cancel', protect, rejectCancellation);
router.post('/:id/process-refund', protect, processRefund);

module.exports = router;

