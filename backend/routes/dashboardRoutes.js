const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Get overall analytics metrics
router.get('/stats', authenticateToken, getDashboardStats);

module.exports = router;
