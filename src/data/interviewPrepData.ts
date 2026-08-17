import { InterviewQnA, PhaseItem } from '../types';

export const INTERVIEW_QUESTIONS: InterviewQnA[] = [
  {
    id: 'why-react',
    topic: 'Frontend Architecture',
    question: 'Why did you choose React for this application?',
    answer: 'React was chosen for its component-based architecture, virtual DOM for performant UI updates, declarative state management, and large ecosystem.',
    bullet_points: [
      'Component Reusability: Modals, ticket status badges, metric cards, and charts are reusable modular components.',
      'Unidirectional Data Flow: Predictable state transitions when a ticket status changes or when new responses are posted.',
      'Ecosystem & Tooling: Seamless integration with Tailwind CSS and Recharts for interactive analytics.',
      'Single Page Application (SPA): Fast navigation between customer views, agent queues, and admin analytics without page reloads.'
    ],
    key_takeaway: 'React allows building a responsive, reactive single-page dashboard where ticket status changes update instantly without full page reloads.'
  },
  {
    id: 'why-node-express',
    topic: 'Backend Architecture',
    question: 'Why did you choose Node.js and Express for the REST API?',
    answer: 'Node.js offers non-blocking asynchronous I/O ideal for high-concurrency ticket submissions and microservice proxying, while Express provides a minimalist, unopinionated routing and middleware pipeline.',
    bullet_points: [
      'Asynchronous Event-Driven Architecture: Single-threaded event loop handles concurrent customer requests efficiently.',
      'Single Language Full-Stack (JavaScript/TypeScript): Shared data models, validation logic, and reduced context switching.',
      'Microservice Orchestrator: Node.js acts as an API gateway that coordinates between the MySQL database and the Python ML service.',
      'Middleware Pipeline: Modular handling of JWT verification, role-based authorization, rate limiting, and error handling.'
    ],
    key_takeaway: 'Node.js is lightweight, fast for I/O-bound tasks, and easily orchestrates asynchronous calls between MySQL and Python microservices.'
  },
  {
    id: 'why-rest',
    topic: 'API Design',
    question: 'Why use REST APIs instead of GraphQL or WebSockets?',
    answer: 'REST (Representational State Transfer) is standard, stateless, cacheable, and maps naturally to CRUD operations on resources like tickets and users.',
    bullet_points: [
      'Standard HTTP Verbs: Clear semantic actions (GET /api/tickets, POST /api/tickets, PUT /api/tickets/:id/status, DELETE /api/tickets/:id).',
      'Statelessness: Each request contains all necessary JWT credentials, making the API horizontally scalable.',
      'Uniform Interface: Easily consumed by web clients, mobile apps, or third-party webhooks.',
      'Simplicity & Interview Standard: Standard architecture that every interviewer evaluates for fundamental software design.'
    ],
    key_takeaway: 'REST provides predictable, decoupled resource endpoints with standard HTTP status codes (200, 201, 400, 401, 403, 404, 500).'
  },
  {
    id: 'why-mysql',
    topic: 'Database Design',
    question: 'Why choose MySQL relational database over MongoDB (NoSQL)?',
    answer: 'Support ticket systems require strict schema validation, ACID transactional integrity, and strong relational integrity between Users, Tickets, and Responses.',
    bullet_points: [
      'ACID Compliance: Guarantees consistency during critical state changes (e.g. ticket assignment or status transition).',
      'Foreign Key Constraints: Enforces relational integrity (CASCADE delete for responses when a ticket is deleted, SET NULL on agent delete).',
      'Relational Joins: Easily join users and tickets in a single query (e.g. SELECT tickets.*, users.name FROM tickets JOIN users ON tickets.user_id = users.id).',
      'Indexing: Fast indexed lookups on status, category, priority, and user_id for high-speed dashboard filtering.'
    ],
    key_takeaway: 'Relational data with fixed foreign-key relationships (User -> Tickets -> Responses) is best served by SQL with ACID guarantees.'
  },
  {
    id: 'how-jwt-works',
    topic: 'Authentication & Security',
    question: 'How does JWT (JSON Web Token) authentication work in this project?',
    answer: 'JWT is a compact, URL-safe token consisting of three parts: Header, Payload, and Signature (Header.Payload.Signature).',
    bullet_points: [
      'Step 1: User sends email and password to POST /api/auth/login.',
      'Step 2: Server verifies password hash and creates a signed token containing { id, role, email } signed with a secret key.',
      'Step 3: Client stores token in localStorage/cookie and sends it in the Authorization: Bearer <token> header for subsequent requests.',
      'Step 4: Express middleware jwt.verify() extracts the payload without querying the database for every single route check.'
    ],
    key_takeaway: 'JWT enables stateless authentication — the server does not need to store active session IDs in server memory or Redis.'
  },
  {
    id: 'how-bcrypt-works',
    topic: 'Security & Cryptography',
    question: 'How does Bcrypt password hashing work, and why not MD5 or SHA256?',
    answer: 'Bcrypt is an adaptive cryptographic hash function that incorporates a salt and a configurable work factor (cost) to protect against rainbow table and brute-force attacks.',
    bullet_points: [
      'Salting: Generates random cryptographic bytes prepended to the password before hashing, ensuring two identical passwords yield different hashes.',
      'Adaptive Work Factor: Configurable iterations (e.g. cost factor 10) make hash calculation deliberately slow enough to prevent GPU brute-forcing.',
      'Why not SHA256/MD5?: MD5/SHA256 are designed for speed and checksums; attackers can compute billions of hashes per second using GPUs.',
      'Verification: bcrypt.compare(inputPassword, storedHash) hashes the input with the stored salt and compares in constant time.'
    ],
    key_takeaway: 'Bcrypt protects against rainbow tables and brute force by combining random salting with computationally expensive iterations.'
  },
  {
    id: 'authn-vs-authz',
    topic: 'Security Architecture',
    question: 'What is the difference between Authentication and Authorization?',
    answer: 'Authentication verifies WHO you are; Authorization verifies WHAT permissions you have.',
    bullet_points: [
      'Authentication (AuthN): Verifying user identity via email/password or JWT signature. Example: "Are you Alex Rivera?"',
      'Authorization (AuthZ): Enforcing role permissions based on user.role (customer, agent, admin). Example: "Can Alex Rivera change another ticket status? No (Customer cannot; only Agent/Admin can)."',
      'Implementation: authenticateToken middleware handles AuthN; authorizeRoles("admin", "agent") middleware handles AuthZ.'
    ],
    key_takeaway: 'AuthN answers "Who is this user?", while AuthZ answers "Is this user allowed to perform this specific action?"'
  },
  {
    id: 'how-tfidf-works',
    topic: 'Machine Learning & NLP',
    question: 'What is TF-IDF and how does it convert ticket text into numbers?',
    answer: 'TF-IDF (Term Frequency - Inverse Document Frequency) is a numerical statistic that reflects how important a word is to a document in a collection.',
    bullet_points: [
      'Term Frequency (TF): Measures how frequently a word appears in a specific ticket: TF(t, d) = (Count of term t in ticket d) / (Total words in ticket d).',
      'Inverse Document Frequency (IDF): Penalizes common words appearing across all tickets: IDF(t) = log(Total tickets / (Tickets containing term t + 1)). Words like "the", "is", "please" get near-zero IDF.',
      'TF-IDF Formula: TF-IDF(t, d) = TF(t, d) * IDF(t). Domain-specific words like "refund", "crash", "invoice" receive high weights.',
      'Feature Vector: Converts arbitrary text into a fixed-length numerical vector X suitable for Scikit-learn classification algorithms.'
    ],
    key_takeaway: 'TF-IDF turns unstructured text into numerical feature vectors by weighting informative terms high and common stopwords low.'
  },
  {
    id: 'why-logistic-regression',
    topic: 'Machine Learning & NLP',
    question: 'Why use Logistic Regression for ticket classification instead of Deep Learning / BERT?',
    answer: 'Multinomial Logistic Regression is fast, highly interpretable, lightweight to train on small-to-medium tabular/text datasets, and consumes negligible CPU/RAM.',
    bullet_points: [
      'Linear Decision Boundary with Softmax: P(y=Category_k | x) = exp(w_k * x) / sum(exp(w_j * x)), producing calibrated probabilities.',
      'Explainability: We can inspect feature weights (w_i) to see exactly why "charge" or "failed" triggered the Billing category.',
      'Resource Efficiency: Trains in < 1 second on CPU, requires no GPU, and has low latency (< 10ms per inference).',
      'Student Project Fit: Easy to explain the math and logic during placement interviews without black-box complexity.'
    ],
    key_takeaway: 'Logistic Regression with TF-IDF provides high accuracy for text classification with instant inference, low memory footprint, and full interpretability.'
  },
  {
    id: 'how-sentiment-works',
    topic: 'Machine Learning & NLP',
    question: 'How does the Sentiment Analysis module work?',
    answer: 'The system implements a lexicon-based polarity analyzer combined with rule-based scoring (VADER/AFINN principles) for student explainability.',
    bullet_points: [
      'Lexicon Matching: Checks text against curated positive sentiment words ("helpful", "fast", "thanks", "great") and negative words ("failed", "stuck", "frustrated", "charged", "worst").',
      'Polarity Score Calculation: Score = Count(Positive Words) - Count(Negative Words).',
      'Thresholding: Score < 0 -> Negative; Score > 0 -> Positive; Score == 0 -> Neutral.',
      'Why Lexicon?: Deterministic, explainable in 1 minute to an interviewer, and directly helps prioritize frustrated customers.'
    ],
    key_takeaway: 'Lexicon sentiment analysis maps emotional polarity directly to triage priority so urgent, negative tickets get instant attention.'
  },
  {
    id: 'ticket-lifecycle',
    topic: 'System Workflow',
    question: 'Walk me through the complete end-to-end lifecycle when a customer submits a ticket.',
    answer: 'A single ticket submission touches the React frontend, Express backend, Python ML service, MySQL database, and real-time dashboard.',
    bullet_points: [
      '1. Customer fills out title and description on React frontend and submits form.',
      '2. React sends POST /api/tickets with JWT bearer token in header.',
      '3. Node.js backend verifies JWT, extracts customer user_id.',
      '4. Node.js makes an internal HTTP POST to Python ML Service at http://localhost:5000/predict.',
      '5. Python ML service cleans text, runs TF-IDF + Logistic Regression, predicts Category, Priority, Sentiment, and selects Suggested Response.',
      '6. Python returns JSON payload back to Node.js.',
      '7. Node.js executes INSERT INTO tickets (...) VALUES (...) in MySQL.',
      '8. Node.js returns HTTP 201 Created with full ticket data back to React.',
      '9. React dashboard adds the ticket to the UI and updates agent metrics.'
    ],
    key_takeaway: 'The lifecycle follows a clean decoupling: React (UI) -> Node.js (API Gateway/DB) -> Python (ML/NLP) -> MySQL (Storage).'
  }
];

export const PHASE_GUIDE: PhaseItem[] = [
  {
    id: 1,
    phase_number: 1,
    title: 'Phase 1: Project Architecture & MySQL Database Schema',
    subtitle: 'Setting up clean folder structure and relational database tables',
    description: 'We establish the foundational architecture, directory layout, and relational schema in MySQL with proper primary keys, foreign keys, and indexes.',
    folder_structure: `customer-support-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
├── database/
│   └── schema.sql
├── frontend/
│   └── src/
├── ml-service/
│   ├── app.py
│   ├── train_model.py
│   └── requirements.txt
└── README.md`,
    code_filename: 'database/schema.sql',
    code_snippet: `CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'agent', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
    FOREIGN KEY (assigned_agent) REFERENCES users(id) ON DELETE SET NULL
);`,
    explanation_points: [
      'users table stores authentication credentials with hashed passwords and role ENUM.',
      'tickets table is the central entity with foreign keys referencing users(id) for customer and agent.',
      'ON DELETE CASCADE deletes tickets when a user is deleted; ON DELETE SET NULL preserves tickets if an agent leaves.',
      'Indexes are added on status, category, priority, and user_id to optimize filtering queries.'
    ],
    run_commands: [
      '# 1. Start MySQL Server',
      'mysql -u root -p',
      '# 2. Execute the schema script',
      'source database/schema.sql;',
      '# 3. Verify tables created',
      'SHOW TABLES;'
    ],
    test_instructions: [
      'Run SHOW TABLES; and verify users, tickets, and ticket_responses exist.',
      'Run DESCRIBE tickets; and check column types and foreign key constraints.',
      'Execute SELECT * FROM users; to verify seed data.'
    ],
    common_errors: [
      {
        error: 'ERROR 1005 (HY000): Can\'t create table (errno: 150 "Foreign key constraint is incorrectly formed")',
        fix: 'Ensure parent table (users) is created BEFORE child table (tickets), and both id columns have matching data types (INT).'
      },
      {
        error: 'Access denied for user root@localhost',
        fix: 'Verify MySQL root password in .env file or reset password via ALTER USER \'root\'@\'localhost\' IDENTIFIED BY \'password\';.'
      }
    ]
  },
  {
    id: 2,
    phase_number: 2,
    title: 'Phase 2: Node.js & Express REST Backend Setup',
    subtitle: 'Initializing Express server, MySQL connection pool, and test routes',
    description: 'We configure the Express.js server, connect to MySQL using mysql2 with connection pooling, and configure JSON body parsing.',
    folder_structure: `backend/
├── config/
│   └── db.js
├── server.js
├── package.json
└── .env`,
    code_filename: 'backend/config/db.js & server.js',
    code_snippet: `// backend/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'support_ticket_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Server listening on port \${PORT}\`));`,
    explanation_points: [
      'mysql2/promise enables modern async/await syntax for clean SQL queries.',
      'Connection pooling manages multiple reusable database connections instead of opening/closing sockets per request.',
      'express.json() parses incoming JSON request bodies.',
      'CORS middleware permits cross-origin requests from the React frontend.'
    ],
    run_commands: [
      'cd backend',
      'npm init -y',
      'npm install express mysql2 dotenv cors bcryptjs jsonwebtoken axios',
      'node server.js'
    ],
    test_instructions: [
      'Open browser or Postman and hit GET http://localhost:5000/api/health.',
      'Verify that { "status": "healthy" } is returned with HTTP 200.'
    ],
    common_errors: [
      {
        error: 'ECONNREFUSED 127.0.0.1:3306',
        fix: 'Ensure MySQL daemon is running on your system (e.g. systemctl start mysql or start XAMPP/MySQL service).'
      },
      {
        error: 'Cannot find module express',
        fix: 'Run npm install inside the backend directory to populate node_modules.'
      }
    ]
  },
  {
    id: 3,
    phase_number: 3,
    title: 'Phase 3: Authentication & Role-Based Access Control (RBAC)',
    subtitle: 'Implementing Bcrypt password hashing, JWT generation, and role authorization middleware',
    description: 'We build user registration, login with hashed passwords, JWT token signing, and Express middleware for role authorization.',
    folder_structure: `backend/
├── controllers/
│   └── authController.js
├── middleware/
│   └── authMiddleware.js
└── routes/
    └── authRoutes.js`,
    code_filename: 'backend/controllers/authController.js',
    code_snippet: `// Hashing password during registration
const hashedPassword = await bcrypt.hash(password, 10);
await db.execute(
  'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
  [name, email, hashedPassword, role || 'customer']
);

// Login and JWT signing
const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
const user = rows[0];
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

const token = jwt.sign(
  { id: user.id, name: user.name, role: user.role },
  process.env.JWT_SECRET || 'supersecretkey',
  { expiresIn: '24h' }
);
res.json({ token, user: { id: user.id, name: user.name, role: user.role } });`,
    explanation_points: [
      'bcrypt.hash(password, 10) salts and hashes user passwords before database storage.',
      'jwt.sign() encodes user claims and signs them with a secret key.',
      'authMiddleware verifies the token on protected routes and attaches req.user.',
      'authorizeRoles middleware enforces role privileges (Customer vs Agent vs Admin).'
    ],
    run_commands: [
      '# Test register endpoint in Postman',
      'POST http://localhost:5000/api/auth/register',
      'Body: { "name": "Alex", "email": "alex@test.com", "password": "pass", "role": "customer" }'
    ],
    test_instructions: [
      'Register a new customer account.',
      'Login with the registered credentials and verify receipt of a valid JWT token.',
      'Attempt login with an invalid password and ensure HTTP 401 Unauthorized is returned.'
    ],
    common_errors: [
      {
        error: 'JsonWebTokenError: jwt malformed',
        fix: 'Ensure request headers include Authorization: Bearer <token> with a single space.'
      },
      {
        error: 'Duplicate entry for key idx_user_email',
        fix: 'Catch ER_DUP_ENTRY error in SQL controller and return a user-friendly 400 "Email already registered".'
      }
    ]
  },
  {
    id: 4,
    phase_number: 4,
    title: 'Phase 4: React Customer & Agent Frontend Architecture',
    subtitle: 'Building the component layout, authentication context, and navigation',
    description: 'We construct the React SPA with navigation tabs, role-based views (Customer vs Agent/Admin), and top bar controls.',
    folder_structure: `frontend/src/
├── components/
│   ├── Navbar.tsx
│   ├── CustomerDashboard.tsx
│   ├── AgentDashboard.tsx
│   ├── CreateTicketModal.tsx
│   └── TicketDetailModal.tsx
├── context/
│   └── AuthContext.tsx
└── App.tsx`,
    code_filename: 'frontend/src/App.tsx',
    code_snippet: `export default function App() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        {user.role === 'customer' ? (
          <CustomerDashboard />
        ) : (
          <AgentDashboard />
        )}
      </main>
    </div>
  );
}`,
    explanation_points: [
      'AuthContext provides current user state and token across all components.',
      'Conditional rendering displays customer-specific views or agent/admin workspaces.',
      'Modular components keep code clean and easy to explain.'
    ],
    run_commands: [
      'cd frontend',
      'npm install lucide-react recharts',
      'npm run dev'
    ],
    test_instructions: [
      'Open http://localhost:3000 in browser.',
      'Toggle between Customer and Agent roles and verify corresponding dashboard rendering.'
    ],
    common_errors: [
      {
        error: 'Module not found: Can\'t resolve lucide-react',
        fix: 'Run npm install lucide-react in your project folder.'
      }
    ]
  },
  {
    id: 5,
    phase_number: 5,
    title: 'Phase 5: Ticket CRUD Operations & State Management',
    subtitle: 'Implementing ticket creation, retrieval, status updates, and responses',
    description: 'We implement complete REST endpoints and frontend handlers for creating tickets, updating status (Open -> In Progress -> Resolved), and posting replies.',
    folder_structure: `backend/
├── controllers/
│   └── ticketController.js
└── routes/
    └── ticketRoutes.js`,
    code_filename: 'backend/controllers/ticketController.js',
    code_snippet: `// GET /api/tickets (Filtered by role)
exports.getTickets = async (req, res) => {
  const { role, id: userId } = req.user;
  let sql = 'SELECT * FROM tickets';
  let params = [];

  if (role === 'customer') {
    sql += ' WHERE user_id = ? ORDER BY created_at DESC';
    params.push(userId);
  } else {
    sql += ' ORDER BY created_at DESC';
  }

  const [tickets] = await db.execute(sql, params);
  res.json(tickets);
};

// PUT /api/tickets/:id/status
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await db.execute('UPDATE tickets SET status = ? WHERE id = ?', [status, id]);
  res.json({ message: 'Status updated successfully' });
};`,
    explanation_points: [
      'Role-scoped queries ensure customers only query their own tickets, while agents view all tickets.',
      'Parameterized queries (? placeholders) prevent SQL injection vulnerabilities.',
      'Response threads record timestamps and author roles for auditability.'
    ],
    run_commands: [
      '# Test create ticket API',
      'POST http://localhost:5000/api/tickets',
      'Headers: Authorization: Bearer <token>',
      'Body: { "title": "Double charge", "description": "Money deducted twice" }'
    ],
    test_instructions: [
      'Submit a ticket from the customer form.',
      'Switch to Agent view and verify the ticket appears in the queue.',
      'Change ticket status to "In Progress" and verify state update in database.'
    ],
    common_errors: [
      {
        error: 'SQL syntax error near ?',
        fix: 'Verify number of parameters passed matches the count of ? placeholders in db.execute().'
      }
    ]
  },
  {
    id: 6,
    phase_number: 6,
    title: 'Phase 6: Python NLP & ML Service (TF-IDF + Logistic Regression)',
    subtitle: 'Building text classification, priority ranking, and sentiment analysis in Flask',
    description: 'We build a lightweight Python Flask service that cleans ticket text, uses TF-IDF + Logistic Regression for category/priority prediction, and applies lexicon sentiment analysis.',
    folder_structure: `ml-service/
├── app.py
├── train_model.py
├── requirements.txt
└── models/
    ├── tfidf_category.pkl
    └── model_category.pkl`,
    code_filename: 'ml-service/app.py',
    code_snippet: `from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    text = f"{data.get('title', '')} {data.get('description', '')}".lower()
    
    # 1. Category Classification
    category = clf_category.predict(tfidf.transform([text]))[0]
    
    # 2. Priority Prediction
    priority = "High" if any(w in text for w in ['urgent', 'emergency', 'deducted']) else "Medium"
    
    # 3. Sentiment Analysis (Lexicon polarity)
    pos = sum(1 for w in text.split() if w in POSITIVE_WORDS)
    neg = sum(1 for w in text.split() if w in NEGATIVE_WORDS)
    sentiment = "Negative" if neg > pos else ("Positive" if pos > neg else "Neutral")
    
    return jsonify({
        "category": category,
        "priority": priority,
        "sentiment": sentiment,
        "suggested_response": get_template(category, sentiment)
    })`,
    explanation_points: [
      'TF-IDF converts arbitrary text into numeric feature vectors.',
      'Multinomial Logistic Regression calculates class probabilities for Billing, Tech, Account, etc.',
      'Lexicon Sentiment Analysis counts polarity scores to gauge customer urgency.',
      'Response Template Engine selects pre-crafted responses based on predicted Category + Sentiment.'
    ],
    run_commands: [
      'cd ml-service',
      'pip install -r requirements.txt',
      'python train_model.py',
      'python app.py'
    ],
    test_instructions: [
      'Run curl -X POST http://localhost:5000/predict -H "Content-Type: application/json" -d \'{"title":"Charged twice", "description":"Card billed twice"}\'',
      'Verify JSON output containing category="Billing", priority="High", sentiment="Negative".'
    ],
    common_errors: [
      {
        error: 'ModuleNotFoundError: No module named sklearn',
        fix: 'Run pip install scikit-learn pandas flask in your Python environment.'
      }
    ]
  },
  {
    id: 7,
    phase_number: 7,
    title: 'Phase 7: Connecting Node.js Backend with Python ML Service',
    subtitle: 'Implementing HTTP microservice communication between Express and Flask',
    description: 'When a new ticket is submitted, Node.js makes an internal HTTP call to the Python service, receives AI predictions, and stores them in MySQL.',
    folder_structure: `backend/
├── services/
│   └── mlClient.js
└── controllers/
    └── ticketController.js`,
    code_filename: 'backend/services/mlClient.js',
    code_snippet: `const axios = require('axios');

async function predictTicketAI(title, description) {
  try {
    const response = await axios.post('http://localhost:5000/predict', {
      title,
      description
    }, { timeout: 3000 });
    
    return response.data;
  } catch (error) {
    console.warn('ML Service unreachable, using rule fallback:', error.message);
    return {
      category: 'General',
      priority: 'Medium',
      sentiment: 'Neutral',
      suggested_response: 'Thank you for reaching out. Our support team will assist you shortly.'
    };
  }
}`,
    explanation_points: [
      'Microservice Architecture: Node.js acts as an API gateway and delegator.',
      'Graceful Fallback: If the Python service is offline or times out, Node.js applies a default rule fallback so ticket submission never fails.',
      'Decoupled Scaling: Python ML processes can be scaled independently of the Node API.'
    ],
    run_commands: [
      '# Ensure both backend and ml-service are running simultaneously',
      '# Terminal 1: python ml-service/app.py (port 5000)',
      '# Terminal 2: node backend/server.js (port 5001)'
    ],
    test_instructions: [
      'Submit a ticket from frontend: "Account locked after password reset".',
      'Inspect database row and verify category is "Account", priority is "High", sentiment is "Negative".'
    ],
    common_errors: [
      {
        error: 'AxiosError: connect ECONNREFUSED 127.0.0.1:5000',
        fix: 'Start the Python Flask service (python ml-service/app.py) before testing.'
      }
    ]
  },
  {
    id: 8,
    phase_number: 8,
    title: 'Phase 8: Admin Dashboard & Analytics',
    subtitle: 'Building summary metric cards, interactive charts, and ticket assignment',
    description: 'We construct the Admin / Support Lead Dashboard with metric aggregation and interactive Recharts visualizations for Category, Priority, and Status distributions.',
    folder_structure: `frontend/src/
├── components/
│   ├── AnalyticsDashboard.tsx
│   ├── MetricCards.tsx
│   └── AssignAgentModal.tsx
└── services/
    └── api.ts`,
    code_filename: 'frontend/src/components/AnalyticsDashboard.tsx',
    code_snippet: `<ResponsiveContainer width="100%" height={260}>
  <BarChart data={stats.category_distribution}>
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
    <XAxis dataKey="name" stroke="#94a3b8" />
    <YAxis stroke="#94a3b8" />
    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>`,
    explanation_points: [
      'SQL Aggregation: SELECT category, COUNT(*) as count FROM tickets GROUP BY category; computes server-side stats efficiently.',
      'Recharts library provides responsive, interactive data visualization.',
      'Agent assignment dropdown allows instant routing of open tickets.'
    ],
    run_commands: [
      'npm run build',
      'npm run dev'
    ],
    test_instructions: [
      'Navigate to Analytics tab.',
      'Verify that bar charts and pie charts reflect the exact count of tickets in the database.'
    ],
    common_errors: [
      {
        error: 'Chart container width/height 0px in flex container',
        fix: 'Ensure parent div has an explicit height (e.g. h-64 or h-72) when using ResponsiveContainer.'
      }
    ]
  },
  {
    id: 9,
    phase_number: 9,
    title: 'Phase 9: UI Polish, Form Validation & Error Handling',
    subtitle: 'Adding search filters, priority color-coding, and toast feedback',
    description: 'We refine the user interface with search bars, multi-attribute filter pills (Category, Priority, Sentiment, Status), and copy-paste ready suggested responses.',
    folder_structure: `frontend/src/
├── components/
│   ├── FilterBar.tsx
│   ├── Toast.tsx
│   └── Badge.tsx`,
    code_filename: 'frontend/src/components/AgentDashboard.tsx',
    code_snippet: `// Multi-attribute filtering in React
const filteredTickets = tickets.filter(ticket => {
  const matchesSearch = ticket.title.toLowerCase().includes(search.toLowerCase()) ||
                        ticket.description.toLowerCase().includes(search.toLowerCase());
  const matchesCategory = filterCategory === 'ALL' || ticket.category === filterCategory;
  const matchesPriority = filterPriority === 'ALL' || ticket.priority === filterPriority;
  const matchesStatus = filterStatus === 'ALL' || ticket.status === filterStatus;
  return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
});`,
    explanation_points: [
      'Client-side search and filtering provides instantaneous UI feedback without database thrashing.',
      'Color-coded badges (Red for High Priority / Negative Sentiment, Green for Resolved / Positive) improve triage efficiency.',
      'One-click "Use Suggested Response" button accelerates agent response time.'
    ],
    run_commands: [
      'npm run lint'
    ],
    test_instructions: [
      'Type "payment" in search bar and verify only billing/payment tickets are shown.',
      'Filter by Priority = "High" and verify lower priority items are hidden.'
    ],
    common_errors: [
      {
        error: 'Uncaught TypeError: Cannot read property toLowerCase of undefined',
        fix: 'Ensure fallback (ticket.title || "").toLowerCase() is used to avoid null reference errors.'
      }
    ]
  },
  {
    id: 10,
    phase_number: 10,
    title: 'Phase 10: End-to-End Testing & Placement Viva Prep',
    subtitle: 'Verifying end-to-end user journeys and preparing viva answers',
    description: 'We execute complete end-to-end tests across all roles and practice answering core questions about architecture, algorithms, and system trade-offs.',
    folder_structure: `Root/
├── README.md
├── database/schema.sql
├── ml-service/
└── backend/`,
    code_filename: 'README.md (Summary Checklist)',
    code_snippet: `## System Architecture Summary
1. Customer submits issue -> React captures payload
2. Express backend authenticates JWT token
3. Express calls Python Flask ML Service
4. Python TF-IDF + Logistic Regression returns Category, Priority, Sentiment, Suggested Response
5. Express inserts into MySQL database
6. Real-time updates reflect in Customer & Agent dashboards`,
    explanation_points: [
      'Know your project: Be ready to explain the complete request path from browser click to database insert.',
      'Understand trade-offs: Why TF-IDF + Logistic Regression was chosen over large transformer models (speed, simplicity, low hardware footprint).',
      'Explain ACID and relational benefits: How foreign keys prevent orphaned responses.'
    ],
    run_commands: [
      '# Run full verification test suite',
      'npm run build'
    ],
    test_instructions: [
      'Create 3 test tickets as a customer with different problem domains (Billing, Tech, Account).',
      'Log in as Agent, review AI predictions, edit suggested response, post reply, and resolve ticket.',
      'Log in as Admin, check Analytics charts to confirm updated resolution counts.'
    ],
    common_errors: [
      {
        error: 'Stale state after role switch',
        fix: 'Ensure auth state change triggers a fresh fetch of tickets and user permissions.'
      }
    ]
  }
];
