const express = require('express');
const router = express.Router();
const { getDashboardStats, getNotifications, markNotificationAsRead } = require('../controllers/dashboardController');

router.get('/stats', getDashboardStats);
router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);

module.exports = router;

