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
      destination,
      contactPhone,
      specialRequests,
      // Manual/Admin fields
      contactName,
      contactEmail,
      status,
      paymentStatus,
      paymentMethod,
      paymentId,
    } = req.body;

    if (!packageId || !packageName || !totalPrice || !tripDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required booking details',
      });
    }

    // If user is authenticated, use their ID. If it's an admin creating for someone else, 
    // we might want to leave user null or link to a specific user if provided.
    // For now, if req.user exists and it's NOT an admin creating a manual booking (detected via contactName presence maybe?), use it.
    // Actually, simple logic: if req.user is set, use it. But if it's admin, and they provided contactName, maybe we treat it as "guest" or "manual" booking linked to admin?
    // Let's just use req.user._id if available. If it's admin, it will be admin's ID. 
    // If we want to support "No User" bookings, we need to ensure req.user check doesn't block it (middleware). 
    // But `protect` middleware ensures req.user is set. 
    
    const bookingData = {
      user: req.user._id,
      packageId,
      packageName,
      packageImage: packageImage || '',
      travelers,
      tripDate,
      totalPrice,
      destination,
      contactPhone,
      specialRequests,
      contactName: contactName || req.user.name,
      contactEmail: contactEmail || req.user.email,
    };

    // Allow Admin to override defaults
    if (req.user.role === 'admin') {
      if (status) bookingData.status = status;
      if (paymentStatus) bookingData.paymentStatus = paymentStatus;
      if (paymentMethod) bookingData.paymentMethod = paymentMethod;
      if (paymentId) bookingData.paymentId = paymentId;
      
      // If admin provided explicit contact details, prioritize them
      if (contactName) bookingData.contactName = contactName;
      if (contactEmail) bookingData.contactEmail = contactEmail;
    }

    const booking = await Booking.create(bookingData);

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const count = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('user', 'name email') // Populate user details for admin view
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count, // Total count of bookings
      pages: Math.ceil(count / limit),
      page,
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

// @desc    Update booking status (Admin only)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      if (status) booking.status = status;
      if (paymentStatus) booking.paymentStatus = paymentStatus;

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

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking) {
      await booking.deleteOne();
      res.json({
        success: true,
        message: 'Booking removed',
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
  updateBookingStatus,
  deleteBooking,
};
