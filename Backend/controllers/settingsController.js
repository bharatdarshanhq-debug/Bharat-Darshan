const Settings = require('../models/Settings');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Public (some fields might need to be filtered for public, but for now sending all)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // If no settings exist, create default
    if (!settings) {
      settings = await Settings.create({}); // Create default settings if none exist
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get Settings Error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      // Merge updated fields
      if (req.body.notifications) settings.notifications = { ...settings.notifications, ...req.body.notifications };
      if (req.body.security) settings.security = { ...settings.security, ...req.body.security };
      if (req.body.website) settings.website = { ...settings.website, ...req.body.website };
      if (req.body.payments) settings.payments = { ...settings.payments, ...req.body.payments };
      
      await settings.save();
    }
    
    res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
