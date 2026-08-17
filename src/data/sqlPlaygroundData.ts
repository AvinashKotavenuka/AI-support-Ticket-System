export interface SqlQueryPreset {
  id: string;
  title: string;
  category: 'Aggregations' | 'Joins' | 'Filtering' | 'Updates';
  query: string;
  explanation: string;
  interview_tip: string;
}

export const SQL_QUERY_PRESETS: SqlQueryPreset[] = [
  {
    id: 'group-by-category',
    title: 'Tickets count by category (GROUP BY)',
    category: 'Aggregations',
    query: `SELECT category, COUNT(*) AS ticket_count, 
       SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) AS high_priority_count
FROM tickets
GROUP BY category
ORDER BY ticket_count DESC;`,
    explanation: 'Uses GROUP BY and conditional aggregation (SUM CASE) to aggregate total and urgent ticket volume per category.',
    interview_tip: 'Interviewers love asking how to calculate counts of multiple categories in a single scan without subqueries.'
  },
  {
    id: 'join-tickets-users',
    title: 'Tickets with Customer & Assigned Agent Names (INNER & LEFT JOIN)',
    category: 'Joins',
    query: `SELECT 
    t.id AS ticket_id,
    t.title,
    t.category,
    t.priority,
    t.status,
    u.name AS customer_name,
    u.email AS customer_email,
    COALESCE(a.name, 'Unassigned') AS agent_name
FROM tickets t
INNER JOIN users u ON t.user_id = u.id
LEFT JOIN users a ON t.assigned_agent = a.id
ORDER BY t.id DESC;`,
    explanation: 'Demonstrates why INNER JOIN is used for customer (every ticket MUST have a customer) while LEFT JOIN is used for agent (a ticket may not yet be assigned).',
    interview_tip: 'Crucial question: "Why LEFT JOIN on assigned_agent?" -> If you used INNER JOIN, unassigned tickets would be hidden from the result!'
  },
  {
    id: 'unresolved-high-priority',
    title: 'High priority tickets unresolved over 2 hours',
    category: 'Filtering',
    query: `SELECT id, title, category, sentiment, created_at
FROM tickets
WHERE priority = 'High' 
  AND status IN ('Open', 'In Progress')
ORDER BY created_at ASC;`,
    explanation: 'Filters active critical tickets in FIFO order (oldest first) for SLA triage.',
    interview_tip: 'Shows your understanding of composite indexing on (status, priority, created_at).'
  },
  {
    id: 'sentiment-breakdown',
    title: 'Sentiment distribution across categories',
    category: 'Aggregations',
    query: `SELECT 
    category,
    SUM(CASE WHEN sentiment = 'Positive' THEN 1 ELSE 0 END) AS positive_cnt,
    SUM(CASE WHEN sentiment = 'Neutral' THEN 1 ELSE 0 END) AS neutral_cnt,
    SUM(CASE WHEN sentiment = 'Negative' THEN 1 ELSE 0 END) AS negative_cnt
FROM tickets
GROUP BY category;`,
    explanation: 'Pivots sentiment counts into columns per category to detect which product areas generate the most customer frustration.',
    interview_tip: 'Explains how business intelligence dashboards derive actionable customer health scores.'
  }
];

export const DB_SCHEMA_DOCS = [
  {
    name: 'users',
    description: 'Stores customer, support agent, and administrator accounts.',
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT, PK)', desc: 'Unique user identifier' },
      { name: 'name', type: 'VARCHAR(100)', desc: 'Full display name' },
      { name: 'email', type: 'VARCHAR(150) (UNIQUE)', desc: 'Login email address' },
      { name: 'password', type: 'VARCHAR(255)', desc: 'Bcrypt hashed password' },
      { name: 'role', type: "ENUM('customer','agent','admin')", desc: 'Role for authorization' },
      { name: 'department', type: 'VARCHAR(50)', desc: 'Team/department specialization' },
      { name: 'created_at', type: 'TIMESTAMP', desc: 'Account registration time' }
    ]
  },
  {
    name: 'tickets',
    description: 'Core ticket records storing customer issue descriptions and NLP predictions.',
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT, PK)', desc: 'Unique ticket ID' },
      { name: 'user_id', type: 'INT (FK -> users.id)', desc: 'Customer who submitted the ticket' },
      { name: 'title', type: 'VARCHAR(255)', desc: 'Short summary of the issue' },
      { name: 'description', type: 'TEXT', desc: 'Full customer problem description' },
      { name: 'category', type: 'ENUM (Billing, Technical, Account, Product, Delivery, General)', desc: 'Predicted or assigned category' },
      { name: 'priority', type: 'ENUM (Low, Medium, High)', desc: 'Predicted urgency level' },
      { name: 'sentiment', type: 'ENUM (Positive, Neutral, Negative)', desc: 'Customer emotion polarity' },
      { name: 'status', type: 'ENUM (Open, In Progress, Resolved, Closed)', desc: 'Current ticket lifecycle status' },
      { name: 'suggested_response', type: 'TEXT', desc: 'AI-generated response template' },
      { name: 'assigned_agent', type: 'INT (FK -> users.id, NULLABLE)', desc: 'Agent handling this ticket' },
      { name: 'created_at', type: 'TIMESTAMP', desc: 'Submission time' },
      { name: 'updated_at', type: 'TIMESTAMP', desc: 'Last modified time' }
    ]
  },
  {
    name: 'ticket_responses',
    description: 'Thread of communication replies between customer and support agents.',
    columns: [
      { name: 'id', type: 'INT (AUTO_INCREMENT, PK)', desc: 'Unique response identifier' },
      { name: 'ticket_id', type: 'INT (FK -> tickets.id)', desc: 'Associated ticket' },
      { name: 'user_id', type: 'INT (FK -> users.id)', desc: 'Author of the reply' },
      { name: 'message', type: 'TEXT', desc: 'Response body text' },
      { name: 'is_internal_note', type: 'BOOLEAN', desc: 'Internal agent-only note flag' },
      { name: 'created_at', type: 'TIMESTAMP', desc: 'Reply timestamp' }
    ]
  }
];
