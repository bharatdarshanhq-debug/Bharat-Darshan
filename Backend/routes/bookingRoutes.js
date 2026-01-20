const express = require('express');
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, getBookings);

router.route('/:id')
  .get(protect, getBookingById);

module.exports = router;
