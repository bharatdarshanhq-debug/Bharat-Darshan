const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingHotels,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, getBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.route('/:id/hotels')
  .put(protect, updateBookingHotels);

router.route('/:id/status')
  .put(protect, updateBookingStatus);

router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, deleteBooking);

module.exports = router;
