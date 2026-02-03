const express = require('express');
const router = express.Router();
const {
  getStates,
  getStateBySlug,
  getStateDestinations,
  getStatePackages,
} = require('../controllers/stateController');

// GET /api/states - Get all states
router.get('/', getStates);

// GET /api/states/:slug - Get single state by slug
router.get('/:slug', getStateBySlug);

// GET /api/states/:slug/destinations - Get destinations within a state
router.get('/:slug/destinations', getStateDestinations);

// GET /api/states/:slug/packages - Get packages within a state
router.get('/:slug/packages', getStatePackages);

module.exports = router;
