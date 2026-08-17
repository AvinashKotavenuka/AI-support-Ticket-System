const express = require('express');
const router = express.Router();
const {
  register,
  login,
  approveAgent,
  revokeAgent,
  getMe,
  getAllUsers,
  getAllAgents
} = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Public auth routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticateToken, getMe);
router.get('/agents', authenticateToken, getAllAgents);

// Admin-only User & Agent ID Management routes
router.get('/users', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.put('/agents/:id/approve', authenticateToken, authorizeRoles('admin'), approveAgent);
router.put('/agents/:id/revoke', authenticateToken, authorizeRoles('admin'), revokeAgent);

module.exports = router;
