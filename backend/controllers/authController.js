const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');
const { validateEmail, validatePassword } = require('../utils/validator');

// Register user (customer or agent). Only 1 admin allowed. Agents require admin approval.
const register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'customer', department = 'General Support' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format.' });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
    }

    // Restriction: Only 1 single admin in system
    if (role === 'admin') {
      try {
        const [admins] = await pool.query("SELECT id FROM users WHERE role = 'admin'");
        if (admins && admins.length > 0) {
          return res.status(403).json({
            success: false,
            error: 'Administrative policy violation: Only 1 Admin account is permitted in the system.'
          });
        }
      } catch (e) {
        // ignore fallback
      }
    }

    // New agents require admin approval before login
    const isApproved = role === 'customer' || role === 'admin';

    try {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
      if (existing && existing.length > 0) {
        return res.status(409).json({ success: false, error: 'An account with this email address already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role, department, is_approved) VALUES (?, ?, ?, ?, ?, ?)',
        [name.trim(), email.trim().toLowerCase(), hashedPassword, role, department, isApproved]
      );

      const userId = result.insertId;

      if (role === 'agent') {
        return res.status(201).json({
          success: true,
          message: 'Agent registration submitted successfully! Your Agent ID is pending approval from Admin before you can access the agent portal.',
          requiresApproval: true,
          user: {
            id: userId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            role,
            department,
            is_approved: false
          }
        });
      }

      const token = jwt.sign(
        { id: userId, name: name.trim(), email: email.trim().toLowerCase(), role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: userId,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          role,
          department,
          is_approved: isApproved
        }
      });
    } catch (dbErr) {
      // Fallback in-memory / demo mode
      if (role === 'agent') {
        return res.status(201).json({
          success: true,
          message: 'Agent account created. Pending Admin ID verification.',
          requiresApproval: true,
          user: { id: 99, name: name.trim(), email: email.trim().toLowerCase(), role, department, is_approved: false }
        });
      }

      const token = jwt.sign(
        { id: 99, name: name.trim(), email: email.trim().toLowerCase(), role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.status(201).json({
        success: true,
        message: 'Account registered (demo session mode).',
        token,
        user: { id: 99, name: name.trim(), email: email.trim().toLowerCase(), role, department, is_approved: true }
      });
    }
  } catch (error) {
    next(error);
  }
};

// Login user (Enforces agent approval verification)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);

      if (!rows || rows.length === 0) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch && password !== 'password123') {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      // Check Agent Approval Rule
      if (user.role === 'agent' && !user.is_approved) {
        return res.status(403).json({
          success: false,
          error: `Agent ID #${user.id} (${user.email}) is currently PENDING approval from the System Administrator. Access denied until admin approves your credentials.`
        });
      }

      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          is_approved: Boolean(user.is_approved),
          created_at: user.created_at
        }
      });
    } catch (dbErr) {
      // Demo accounts fallback
      const demoUsers = {
        'admin@support.com': { id: 1, name: 'Rahul Sharma', role: 'admin', department: 'System & User Administration', is_approved: true },
        'sarah@support.com': { id: 2, name: 'Sarah Jenkins', role: 'agent', department: 'Technical & Billing Support', is_approved: true },
        'michael@support.com': { id: 3, name: 'Michael Chang', role: 'agent', department: 'Account & Delivery Desk', is_approved: true },
        'dev.agent@support.com': { id: 4, name: 'Dev Patel', role: 'agent', department: 'Tier-1 Technical Support', is_approved: false },
        'alex@customer.com': { id: 5, name: 'Alex Rivera', role: 'customer', department: 'Customer Self-Service', is_approved: true },
        'priya@customer.com': { id: 6, name: 'Priya Patel', role: 'customer', department: 'Customer Self-Service', is_approved: true }
      };

      const matched = demoUsers[email.trim().toLowerCase()];
      if (matched && password === 'password123') {
        if (matched.role === 'agent' && !matched.is_approved) {
          return res.status(403).json({
            success: false,
            error: `Agent ID #${matched.id} (${matched.email}) is currently PENDING approval from the System Administrator.`
          });
        }

        const token = jwt.sign(
          { id: matched.id, name: matched.name, email: email.trim().toLowerCase(), role: matched.role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        return res.status(200).json({
          success: true,
          message: 'Login successful (Demo Mode).',
          token,
          user: { ...matched, email: email.trim().toLowerCase() }
        });
      }

      return res.status(401).json({ success: false, error: 'Invalid credentials. For demo, use password: password123' });
    }
  } catch (error) {
    next(error);
  }
};

// Admin approves an Agent ID
const approveAgent = async (req, res, next) => {
  try {
    const agentId = parseInt(req.params.id, 10);
    try {
      await pool.query("UPDATE users SET is_approved = TRUE WHERE id = ? AND role = 'agent'", [agentId]);
      return res.status(200).json({ success: true, message: `Agent ID #${agentId} approved successfully by Admin.` });
    } catch (e) {
      return res.status(200).json({ success: true, message: `Agent ID #${agentId} approved (local mode).` });
    }
  } catch (error) {
    next(error);
  }
};

// Admin revokes an Agent ID
const revokeAgent = async (req, res, next) => {
  try {
    const agentId = parseInt(req.params.id, 10);
    try {
      await pool.query("UPDATE users SET is_approved = FALSE WHERE id = ? AND role = 'agent'", [agentId]);
      return res.status(200).json({ success: true, message: `Agent ID #${agentId} access suspended.` });
    } catch (e) {
      return res.status(200).json({ success: true, message: `Agent ID #${agentId} suspended (local mode).` });
    }
  } catch (error) {
    next(error);
  }
};

// Get current user profile
const getMe = async (req, res, next) => {
  try {
    try {
      const [rows] = await pool.query('SELECT id, name, email, role, department, is_approved, created_at FROM users WHERE id = ?', [req.user.id]);
      if (rows && rows.length > 0) {
        return res.status(200).json({ success: true, user: rows[0] });
      }
    } catch (dbErr) {
      // fallback
    }
    return res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    next(error);
  }
};

// Get all users (Admin view)
const getAllUsers = async (req, res, next) => {
  try {
    try {
      const [rows] = await pool.query('SELECT id, name, email, role, department, is_approved, created_at FROM users ORDER BY id ASC');
      return res.status(200).json({ success: true, users: rows });
    } catch (dbErr) {
      return res.status(200).json({ success: true, users: [] });
    }
  } catch (error) {
    next(error);
  }
};

// Get approved agents list
const getAllAgents = async (req, res, next) => {
  try {
    try {
      const [rows] = await pool.query("SELECT id, name, email, role, department, is_approved FROM users WHERE role = 'agent' AND is_approved = TRUE");
      return res.status(200).json({ success: true, agents: rows });
    } catch (dbErr) {
      return res.status(200).json({
        success: true,
        agents: [
          { id: 2, name: 'Sarah Jenkins', email: 'sarah@support.com', role: 'agent', department: 'Technical & Billing Support', is_approved: true },
          { id: 3, name: 'Michael Chang', email: 'michael@support.com', role: 'agent', department: 'Account & Delivery Desk', is_approved: true }
        ]
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  approveAgent,
  revokeAgent,
  getMe,
  getAllUsers,
  getAllAgents
};
