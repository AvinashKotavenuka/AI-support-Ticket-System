# System Architecture Documentation

## 1. High-Level Architecture

```text
                    React Frontend (Vite + TS + Tailwind)
                                     │
                                     │ HTTP REST API (JWT Header)
                                     ↓
                      Node.js + Express REST API Gateway
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    │ SQL Queries (mysql2)            │ HTTP JSON Request
                    ↓                                 ↓
            MySQL 8.0 Database              Python ML Microservice (Flask)
        (users, tickets, responses,                   │
               ticket_notes)                 ┌────────┼────────┐
                                             ↓        ↓        ↓
                                         TF-IDF   Priority  Sentiment
                                        Logistic (Heuristic)(Lexicon)
```

## 2. Request Lifecycle: Ticket Submission Flow

1. **User Action**: Customer completes the ticket submission form (Title & Description) in React and clicks "Create Ticket".
2. **Frontend Dispatch**: React client sends an HTTP `POST /api/tickets` request with an `Authorization: Bearer <jwt_token>` header.
3. **Authentication & Validation**: Express middleware (`authenticateToken`) verifies the JWT signature and extracts the user's ID/role. Input validator verifies non-empty title/description.
4. **Machine Learning Inference**: Express invokes the Python ML microservice via `POST http://localhost:5000/predict`.
5. **NLP Execution**:
   - Preprocessing cleans text, strips stopwords, and normalizes casing.
   - TF-IDF vectorizer extracts unigram and bigram frequency features.
   - Logistic Regression model predicts the multi-class category (`Billing`, `Technical`, `Account`, `Delivery`, `Product`, `General`).
   - Priority engine applies urgency keyword heuristics (`High`, `Medium`, `Low`).
   - Sentiment analyzer computes polarity (`Positive`, `Neutral`, `Negative`).
   - Response template generator produces an automated starting reply.
6. **Data Persistence**: Express executes an `INSERT INTO tickets (...)` parameterized query in MySQL 8.0.
7. **Response & Triage**: The created ticket record with predicted metadata is returned to the React frontend. Agents immediately see the new ticket in their triage table.

## 3. Technology Rationale for Placement Interview

| Component | Technology | Technical Reason |
| :--- | :--- | :--- |
| **Frontend** | React 19 + TypeScript | Component reusability, strict type safety, fast Virtual DOM updates |
| **Styling** | Tailwind CSS | Utility-first responsive design, consistent design tokens |
| **Backend** | Node.js + Express | Non-blocking event-driven I/O, lightweight REST API routing |
| **Database** | MySQL 8.0 | ACID compliance, relational foreign key constraints, 3NF normalization |
| **ML Engine** | Python + Scikit-learn | De facto industry standard for TF-IDF feature extraction and linear models |
| **Authentication**| JWT + bcrypt | Stateless secure sessions with salted password encryption |
