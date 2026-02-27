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

const { validateOtaRequest } = require('../middleware/otaRequestMiddleware');

const { protectAdmin } = require('../middleware/adminAuthMiddleware');
const { upload } = require('../utils/imageUpload');

// Configure multer field for hotel images
const hotelUploadField = upload.fields([
  { name: 'images', maxCount: 10 }
]);

// Public routes for fetching
router.get('/', validateOtaRequest, getHotels);
router.get('/:id', getHotelById);

// Admin routes (Protected)
router.post('/', protectAdmin, hotelUploadField, createHotel);
router.put('/:id', protectAdmin, hotelUploadField, updateHotel);
router.delete('/:id', protectAdmin, deleteHotel);

module.exports = router;
