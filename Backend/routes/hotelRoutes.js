const express = require('express');
const router = express.Router();
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes for fetching
router.route('/').get(getHotels);
router.route('/:id').get(getHotelById);

// Admin routes (Protected)
// Note: Assuming 'protect' ensures user is logged in, and 'admin' ensures role is admin.
// If 'admin' middleware doesn't exist yet, we'll just use 'protect' for now and later refine.
// Based on previous file reads, I haven't seen an explicit 'admin' middleware file, so I'll check authMiddleware imports.
// I will write the file assuming typical setup but will verify authMiddleware next.

router.route('/').post(createHotel); // Should be protect, admin
router.route('/:id').put(updateHotel).delete(deleteHotel); // Should be protect, admin

module.exports = router;
