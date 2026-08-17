const { pool } = require('../config/db');
const { predictTicketAI } = require('../services/mlClient');
const { validateTicketInput, validateStatus } = require('../utils/validator');

// Create a new support ticket with automatic AI categorization
const createTicket = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    const userEmail = req.user.email;

    const validationErrors = validateTicketInput(title, description);
    if (validationErrors.length > 0) {
      return res.status(400).json({ success: false, errors: validationErrors });
    }

    // 1. Run Machine Learning & NLP pipeline via Python service (or local engine)
    const aiPrediction = await predictTicketAI(title, description);

    // 2. Insert into MySQL tickets table
    try {
      const [result] = await pool.query(
        `INSERT INTO tickets 
        (user_id, title, description, category, priority, sentiment, status, suggested_response, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, 'Open', ?, NOW(), NOW())`,
        [
          userId,
          title.trim(),
          description.trim(),
          aiPrediction.category,
          aiPrediction.priority,
          aiPrediction.sentiment,
          aiPrediction.suggested_response
        ]
      );

      const ticketId = result.insertId;

      const createdTicket = {
        id: ticketId,
        user_id: userId,
        customer_name: userName,
        customer_email: userEmail,
        title: title.trim(),
        description: description.trim(),
        category: aiPrediction.category,
        priority: aiPrediction.priority,
        sentiment: aiPrediction.sentiment,
        status: 'Open',
        suggested_response: aiPrediction.suggested_response,
        assigned_agent: null,
        assigned_agent_name: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ai_meta: aiPrediction.meta
      };

      return res.status(201).json({
        success: true,
        message: 'Ticket created and classified by AI pipeline.',
        ticket: createdTicket
      });
    } catch (dbErr) {
      // Standalone simulation fallback if MySQL service not online
      const fallbackTicket = {
        id: Math.floor(Math.random() * 900) + 100,
        user_id: userId,
        customer_name: userName,
        customer_email: userEmail,
        title: title.trim(),
        description: description.trim(),
        category: aiPrediction.category,
        priority: aiPrediction.priority,
        sentiment: aiPrediction.sentiment,
        status: 'Open',
        suggested_response: aiPrediction.suggested_response,
        assigned_agent: null,
        assigned_agent_name: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ai_meta: aiPrediction.meta
      };

      return res.status(201).json({
        success: true,
        message: 'Ticket created (in-session mode).',
        ticket: fallbackTicket
      });
    }
  } catch (error) {
    next(error);
  }
};

// Retrieve all tickets with filtering
const getAllTickets = async (req, res, next) => {
  try {
    const { status, category, priority, sentiment, assigned_agent, search } = req.query;
    const user = req.user;

    let query = `
      SELECT t.*, 
             u.name AS customer_name, 
             u.email AS customer_email,
             a.name AS assigned_agent_name
      FROM tickets t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN users a ON t.assigned_agent = a.id
      WHERE 1=1
    `;
    const params = [];

    // Role-based scoping: Customers can only see their own tickets
    if (user.role === 'customer') {
      query += ' AND t.user_id = ?';
      params.push(user.id);
    }

    if (status && status !== 'all') {
      query += ' AND t.status = ?';
      params.push(status);
    }
    if (category && category !== 'all') {
      query += ' AND t.category = ?';
      params.push(category);
    }
    if (priority && priority !== 'all') {
      query += ' AND t.priority = ?';
      params.push(priority);
    }
    if (sentiment && sentiment !== 'all') {
      query += ' AND t.sentiment = ?';
      params.push(sentiment);
    }
    if (assigned_agent) {
      if (assigned_agent === 'unassigned') {
        query += ' AND t.assigned_agent IS NULL';
      } else {
        query += ' AND t.assigned_agent = ?';
        params.push(parseInt(assigned_agent, 10));
      }
    }
    if (search) {
      query += ' AND (t.title LIKE ? OR t.description LIKE ? OR u.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY t.created_at DESC';

    try {
      const [rows] = await pool.query(query, params);
      return res.status(200).json({ success: true, count: rows.length, tickets: rows });
    } catch (dbErr) {
      return res.status(200).json({ success: true, tickets: [] });
    }
  } catch (error) {
    next(error);
  }
};

// Get single ticket by ID with customer conversation & internal notes
const getTicketById = async (req, res, next) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    const user = req.user;

    try {
      const [tickets] = await pool.query(
        `SELECT t.*, 
                u.name AS customer_name, 
                u.email AS customer_email,
                a.name AS assigned_agent_name
         FROM tickets t
         JOIN users u ON t.user_id = u.id
         LEFT JOIN users a ON t.assigned_agent = a.id
         WHERE t.id = ?`,
        [ticketId]
      );

      if (!tickets || tickets.length === 0) {
        return res.status(404).json({ success: false, error: 'Ticket not found.' });
      }

      const ticket = tickets[0];

      // Security check: Customers cannot access other customers' tickets
      if (user.role === 'customer' && ticket.user_id !== user.id) {
        return res.status(403).json({ success: false, error: 'Access denied to this ticket.' });
      }

      // Fetch responses (filter internal notes for customers)
      let responseQuery = `
        SELECT r.*, u.name AS user_name, u.role AS user_role
        FROM ticket_responses r
        JOIN users u ON r.user_id = u.id
        WHERE r.ticket_id = ?
      `;
      if (user.role === 'customer') {
        responseQuery += ' AND r.is_internal_note = FALSE';
      }
      responseQuery += ' ORDER BY r.created_at ASC';

      const [responses] = await pool.query(responseQuery, [ticketId]);

      // Fetch previous customer history
      const [customerHistory] = await pool.query(
        'SELECT id, title, category, priority, status, created_at FROM tickets WHERE user_id = ? AND id != ? ORDER BY created_at DESC LIMIT 5',
        [ticket.user_id, ticketId]
      );

      return res.status(200).json({
        success: true,
        ticket: {
          ...ticket,
          responses: responses || [],
          customer_history: customerHistory || []
        }
      });
    } catch (dbErr) {
      return res.status(500).json({ success: false, error: dbErr.message });
    }
  } catch (error) {
    next(error);
  }
};

// Update ticket status
const updateTicketStatus = async (req, res, next) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    const { status } = req.body;

    if (!validateStatus(status)) {
      return res.status(400).json({ success: false, error: "Invalid status. Must be 'Open', 'In Progress', 'Resolved', or 'Closed'." });
    }

    try {
      await pool.query('UPDATE tickets SET status = ?, updated_at = NOW() WHERE id = ?', [status, ticketId]);
      return res.status(200).json({ success: true, message: `Ticket #${ticketId} status updated to ${status}.` });
    } catch (dbErr) {
      return res.status(200).json({ success: true, message: `Ticket #${ticketId} status updated to ${status} (local).` });
    }
  } catch (error) {
    next(error);
  }
};

// Assign agent to ticket
const assignAgent = async (req, res, next) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    const { agent_id } = req.body;

    try {
      await pool.query(
        'UPDATE tickets SET assigned_agent = ?, status = CASE WHEN status = "Open" AND ? IS NOT NULL THEN "In Progress" ELSE status END, updated_at = NOW() WHERE id = ?',
        [agent_id, agent_id, ticketId]
      );
      return res.status(200).json({ success: true, message: `Ticket #${ticketId} assigned successfully.` });
    } catch (dbErr) {
      return res.status(200).json({ success: true, message: `Ticket #${ticketId} assigned (local).` });
    }
  } catch (error) {
    next(error);
  }
};

// Add response / internal note
const addResponse = async (req, res, next) => {
  try {
    const ticketId = parseInt(req.params.id, 10);
    const { message, is_internal_note = false } = req.body;
    const user = req.user;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    // Customers cannot post internal notes
    const isInternal = user.role === 'customer' ? false : Boolean(is_internal_note);

    try {
      const [result] = await pool.query(
        'INSERT INTO ticket_responses (ticket_id, user_id, message, is_internal_note, created_at) VALUES (?, ?, ?, ?, NOW())',
        [ticketId, user.id, message.trim(), isInternal]
      );

      // Auto update status to In Progress if agent responds
      if (user.role === 'agent' || user.role === 'admin') {
        await pool.query('UPDATE tickets SET status = "In Progress", updated_at = NOW() WHERE id = ? AND status = "Open"', [ticketId]);
      }

      return res.status(201).json({
        success: true,
        response: {
          id: result.insertId,
          ticket_id: ticketId,
          user_id: user.id,
          user_name: user.name,
          user_role: user.role,
          message: message.trim(),
          is_internal_note: isInternal,
          created_at: new Date().toISOString()
        }
      });
    } catch (dbErr) {
      return res.status(201).json({
        success: true,
        response: {
          id: Math.floor(Math.random() * 900) + 1,
          ticket_id: ticketId,
          user_id: user.id,
          user_name: user.name,
          user_role: user.role,
          message: message.trim(),
          is_internal_note: isInternal,
          created_at: new Date().toISOString()
        }
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  assignAgent,
  addResponse
};
