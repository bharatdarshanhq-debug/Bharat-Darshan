const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const {
      packageId,
      packageName,
      packageImage, 
      travelers,
      tripDate,
      totalPrice,
      contactPhone,
      specialRequests,
    } = req.body;

    if (!packageId || !packageName || !totalPrice || !tripDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required booking details',
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
      packageId,
      packageName,
      packageImage: packageImage || '',
      travelers,
      tripDate,
      totalPrice,
      contactPhone,
      specialRequests,
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error',
    });
  }
};


const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};


const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
         return res.status(401).json({
            success: false,
            error: 'Not authorized to view this booking'
         });
      }

      res.json({
        success: true,
        booking,
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Update booking with selected hotels
// @route   PUT /api/bookings/:id/hotels
// @access  Private
const updateBookingHotels = async (req, res) => {
  try {
    const { selectedHotels } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to update this booking'
        });
      }

      booking.selectedHotels = selectedHotels;
      const updatedBooking = await booking.save();

      res.json({
        success: true,
        booking: updatedBooking,
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingHotels,
};
