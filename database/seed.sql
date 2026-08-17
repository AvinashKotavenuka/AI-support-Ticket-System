-- ==========================================================
-- AI Customer Support Ticket Management System - Seed Data
-- ==========================================================

USE support_ticket_db;

-- 1. Insert Users (Single Admin, Approved Agents, Pending Agent, Customers)
-- Password for all demo accounts: 'password123'
INSERT INTO users (id, name, email, password, role, department, is_approved) VALUES
(1, 'Rahul Sharma (Admin)', 'admin@support.com', '$2b$10$wT8m9l7gN0p2qXyZaBcDeOu9F5l7E8v3K2a1J6m5P0o9Q8r7S6t5U', 'admin', 'System & User Administration', TRUE),
(2, 'Sarah Jenkins (Agent)', 'sarah@support.com', '$2b$10$wT8m9l7gN0p2qXyZaBcDeOu9F5l7E8v3K2a1J6m5P0o9Q8r7S6t5U', 'agent', 'Technical & Billing Support', TRUE),
(3, 'Michael Chang (Agent)', 'michael@support.com', '$2b$10$wT8m9l7gN0p2qXyZaBcDeOu9F5l7E8v3K2a1J6m5P0o9Q8r7S6t5U', 'agent', 'Account & Delivery Desk', TRUE),
(4, 'Dev Patel (Pending Agent)', 'dev.agent@support.com', '$2b$10$wT8m9l7gN0p2qXyZaBcDeOu9F5l7E8v3K2a1J6m5P0o9Q8r7S6t5U', 'agent', 'Tier-1 Technical Support', FALSE),
(5, 'Alex Rivera (Customer)', 'alex@customer.com', '$2b$10$wT8m9l7gN0p2qXyZaBcDeOu9F5l7E8v3K2a1J6m5P0o9Q8r7S6t5U', 'customer', 'Customer Self-Service', TRUE),
(6, 'Priya Patel (Customer)', 'priya@customer.com', '$2b$10$wT8m9l7gN0p2qXyZaBcDeOu9F5l7E8v3K2a1J6m5P0o9Q8r7S6t5U', 'customer', 'Customer Self-Service', TRUE);

-- 2. Insert Tickets
INSERT INTO tickets (id, user_id, title, description, category, priority, sentiment, status, suggested_response, assigned_agent, created_at) VALUES
(1, 5, 'Payment deducted twice but order failed', 'My credit card was charged $129 twice for order #ORD-9932, but web checkout displayed transaction failed. Please refund duplicate amount ASAP!', 'Billing', 'High', 'Negative', 'Open', 'We apologize for the billing issue. Our finance team will verify the transaction ID and either confirm your order or process an immediate refund within 24-48 hours.', 2, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 5, 'Locked out of account, 2FA code not arriving', 'I entered my password correctly but SMS 2FA verification token is not delivering. I am locked out of our company dashboard.', 'Account', 'High', 'Negative', 'In Progress', 'We understand how frustrating this is. We have triggered a manual secure reset token for your registered email. Please check your inbox now.', 3, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(3, 6, '500 error when exporting monthly revenue report', 'Whenever I click Export CSV on the monthly analytics page, the server crashes with a 500 internal server error toast.', 'Technical', 'Medium', 'Negative', 'In Progress', 'Thank you for reporting this technical bug. Our engineering team is reviewing the export worker logs and will roll out a patch shortly.', 2, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 6, 'Package marked delivered yesterday but not found in mailbox', 'Courier tracking #DLV-48201 states the package was delivered yesterday at 6 PM, but our concierge has no record of it.', 'Delivery', 'High', 'Negative', 'Open', 'We are sorry about the delivery discrepancy. We have opened a priority courier trace with our logistics partner and will update you within 4 hours.', NULL, DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(5, 5, 'Inquiry regarding Enterprise volume discounts and SLA', 'Hello! Our team is expanding to 25 developers next quarter. Could you share enterprise tier pricing, SSO options, and SLA guarantees?', 'Product', 'Low', 'Positive', 'Resolved', 'Thank you for reaching out! Yes, we offer volume pricing for teams of 5 or more. We have attached the custom quote to your account.', 2, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, 6, 'How do I download tax GST invoice for July 2026?', 'We require the formal GST receipt for tax filing. Where in the billing dashboard can our accounting department retrieve this?', 'Billing', 'Low', 'Neutral', 'Resolved', 'You can update and download your invoice details directly under Settings > Billing > Invoice History.', 3, DATE_SUB(NOW(), INTERVAL 3 DAY));

-- 3. Insert Responses
INSERT INTO ticket_responses (id, ticket_id, user_id, message, is_internal_note, created_at) VALUES
(1, 1, 2, 'Hello Alex, I see the duplicate charge on our payment gateway. I have initiated a full refund of $129 and confirmed order #ORD-9932.', FALSE, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, 2, 3, 'Hi Alex, I have reset your SMS token count and verified your phone carrier connection. Please attempt login now.', FALSE, DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(3, 5, 2, 'Hi Alex, I have sent the 25-seat Enterprise brochure and customized quote to your email.', FALSE, DATE_SUB(NOW(), INTERVAL 2 DAY));

-- 4. Insert Internal Notes
INSERT INTO ticket_notes (id, ticket_id, agent_id, note, created_at) VALUES
(1, 1, 2, 'Stripe transaction ref #tx_982941 marked for refund. Expected bank settlement within 2 business days.', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(2, 2, 3, 'Twilio carrier delivery logs showed temporary SMS network timeout for region.', DATE_SUB(NOW(), INTERVAL 4 HOUR));
