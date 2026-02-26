const Hotel = require('../models/Hotel');
const otaProvider = require('../utils/otaProviders/otaProvider');

// @desc    Get all hotels (with optional filters)
// @route   GET /api/hotels
// @access  Public
const getHotels = async (req, res) => {
  try {
    const { destination, packageType } = req.query;
    let query = { isActive: true };

    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }

    if (packageType) {
      query.packageType = packageType;
    }

    // 1. Fetch from Local DB
    const localHotels = await Hotel.find(query).sort({ createdAt: -1 });

    // 2. Fetch from OTA API
    // Rejection Fix: Abstraction layers isolate provider-specific logic
    let otaHotels = [];
    if (process.env.OTA_CLIENT_ID) {
      otaHotels = await otaProvider.getHotels({ destination, packageType });
    }

    const allHotels = [...localHotels, ...otaHotels];
    
    res.json(allHotels);
  } catch (error) {
    console.error('getHotels Error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching hotels' 
    });
  }
};

// @desc    Get single hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (hotel) {
      res.json(hotel);
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new hotel
// @route   POST /api/hotels
// @access  Admin (Protected)
const createHotel = async (req, res) => {
  try {
    const { 
      name, 
      destination, 
      location, 
      packageType, 
      images, 
      amenities, 
      description, 
      rating,
      otaApiLink 
    } = req.body;

    const hotel = new Hotel({
      name,
      destination,
      location,
      packageType,
      images,
      amenities,
      description,
      rating,
      otaApiLink,
    });

    const createdHotel = await hotel.save();
    res.status(201).json(createdHotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Admin (Protected)
const updateHotel = async (req, res) => {
  try {
    const { 
      name, 
      destination, 
      location, 
      packageType, 
      images, 
      amenities, 
      description, 
      rating, 
      isActive,
      otaApiLink 
    } = req.body;

    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      hotel.name = name || hotel.name;
      hotel.destination = destination || hotel.destination;
      hotel.location = location || hotel.location;
      hotel.packageType = packageType || hotel.packageType;
      hotel.images = images || hotel.images;
      hotel.amenities = amenities || hotel.amenities;
      hotel.description = description || hotel.description;
      hotel.rating = rating !== undefined ? rating : hotel.rating;
      hotel.isActive = isActive !== undefined ? isActive : hotel.isActive;
      hotel.otaApiLink = otaApiLink !== undefined ? otaApiLink : hotel.otaApiLink;

      const updatedHotel = await hotel.save();
      res.json(updatedHotel);
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Admin (Protected)
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      await hotel.deleteOne();
      res.json({ message: 'Hotel removed' });
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
