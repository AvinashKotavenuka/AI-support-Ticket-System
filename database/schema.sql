-- ==========================================================
-- AI Customer Support Ticket Management System
-- Database Schema (MySQL 8.0+)
-- Supports Single Admin & Agent ID Approval Workflow
-- ==========================================================

CREATE DATABASE IF NOT EXISTS support_ticket_db;
USE support_ticket_db;

-- Drop tables in reverse foreign-key dependency order
DROP TABLE IF EXISTS ticket_notes;
DROP TABLE IF EXISTS ticket_responses;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;

-- ==========================================================
-- 1. Table: users
-- Roles: 'customer', 'agent', 'admin'
-- 'is_approved': Boolean flag for agent access control (Admin approves agent IDs)
-- Single Admin policy enforced at application logic
-- ==========================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'agent', 'admin') DEFAULT 'customer',
    department VARCHAR(50) DEFAULT 'General Support',
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email),
    INDEX idx_user_role (role),
    INDEX idx_user_approved (is_approved)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 2. Table: tickets
-- Central table storing tickets & AI/NLP predictions
-- ==========================================================
CREATE TABLE tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category ENUM('Billing', 'Technical', 'Account', 'Product', 'Delivery', 'General') DEFAULT 'General',
    priority ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    sentiment ENUM('Positive', 'Neutral', 'Negative') DEFAULT 'Neutral',
    status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
    suggested_response TEXT,
    assigned_agent INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_agent) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_ticket_status (status),
    INDEX idx_ticket_category (category),
    INDEX idx_ticket_priority (priority),
    INDEX idx_ticket_user (user_id),
    INDEX idx_ticket_agent (assigned_agent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 3. Table: ticket_responses
-- Customer and agent conversation timeline
-- ==========================================================
CREATE TABLE ticket_responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_response_ticket (ticket_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- 4. Table: ticket_notes
-- Private agent internal notes
-- ==========================================================
CREATE TABLE ticket_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    agent_id INT NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    FOREIGN KEY (agent_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_note_ticket (ticket_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
