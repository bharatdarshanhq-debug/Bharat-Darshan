const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { protectAdmin } = require('../middleware/adminAuthMiddleware');

// For now, we'll allow public access to GET (for frontend config) 
// and protect PUT (in a real app, this should be admin only)
// logical-thinking: frontend needs to know if maintenance mode is on BEFORE logging in.

router.route('/')
  .get(getSettings)
  .put(protectAdmin, updateSettings);

module.exports = router;
