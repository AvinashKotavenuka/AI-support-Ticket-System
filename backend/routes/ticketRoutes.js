const express = require('express');
const router = express.Router();
const {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  assignAgent,
  addResponse
} = require('../controllers/ticketController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// All ticket routes require authentication
router.use(authenticateToken);

// Ticket CRUD
router.post('/', createTicket);
router.get('/', getAllTickets);
router.get('/:id', getTicketById);

// Agent/Admin status updates & assignments
router.put('/:id/status', authorizeRoles('agent', 'admin'), updateTicketStatus);
router.put('/:id/assign', authorizeRoles('agent', 'admin'), assignAgent);

// Responses & Notes
router.post('/:id/responses', addResponse);

module.exports = router;
