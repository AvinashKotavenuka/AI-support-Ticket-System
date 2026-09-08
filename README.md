# AI Customer Support Ticket Management & Triage System
URL: https://zesty-salamander-a3314c.netlify.app

An end-to-end full-stack web application designed for BTech Computer Science placement vivas and technical rounds. Features automated NLP ticket classification, priority scoring, sentiment analysis, role-based dashboards, MySQL relational schema, and technical interview preparation.

---

## 🏗️ System Architecture

```text
                    React Frontend (Vite + TypeScript + Tailwind)
                                         │
                                         │ HTTP REST API (JWT Header)
                                         ↓
                          Node.js + Express REST API Gateway
                                         │
                    ┌────────────────────┴────────────────────┐
                    │                                         │
                    │ SQL Queries (mysql2)                    │ HTTP JSON Request
                    ↓                                         ↓
            MySQL 8.0 Database                      Python ML Microservice (Flask)
        (users, tickets, responses,                           │
               ticket_notes)                         ┌────────┼────────┐
                                                     ↓        ↓        ↓
                                                 Category  Priority Sentiment
                                                (TF-IDF)  (Heuristics)(Lexicon)
```

---

## 🔑 Demo Login Credentials

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **Admin** | Rahul Sharma | `admin@support.com` | `password123` |
| **Support Agent** | Sarah Jenkins | `sarah@support.com` | `password123` |
| **Support Agent** | Michael Chang | `michael@support.com` | `password123` |
| **Customer** | Alex Rivera | `alex@customer.com` | `password123` |
| **Customer** | Priya Patel | `priya@customer.com` | `password123` |

---

## 🚀 Step-by-Step Installation & Run Guide

### 1. Database Setup (MySQL 8.0)
1. Open MySQL Workbench or XAMPP MySQL.
2. Run `database/schema.sql` to create tables.
3. Run `database/seed.sql` to populate demo data.

### 2. Python ML Microservice
```bash
cd ml-service
python -m venv venv
# On Windows: venv\Scripts\activate  |  On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python train_model.py
python app.py
```
*Service will start on `http://localhost:5000`.*

### 3. Node.js & Express Backend
```bash
cd backend
npm install
npm run dev
```
*Backend API will run on `http://localhost:5000`.*

### 4. React Frontend
```bash
npm install
npm run dev
```
*Client application runs on `http://localhost:3000`.*

---

## 🧠 Machine Learning & NLP Pipeline

1. **Text Preprocessing**: Lowercase normalization, punctuation stripping, and stopword removal (`preprocessing.py`).
2. **Feature Extraction**: TF-IDF Vectorizer with unigrams & bigrams (`ngram_range=(1, 2)`).
3. **Classification**: Multinomial Logistic Regression (`Scikit-learn`) predicting 6 classes: `Billing`, `Technical`, `Account`, `Delivery`, `Product`, `General`.
4. **Sentiment Polarity**: Lexicon word-matching calculating net emotion score ($\text{Positive} - \text{Negative}$).
5. **Smart Response Generator**: Generates context-aware, editable replies for support agents.

---

## 📁 Repository Structure

```text
ai-support-ticket-system/
├── backend/                  # Node.js + Express REST API
│   ├── config/               # MySQL connection pool
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # JWT auth & error handlers
│   ├── routes/               # API endpoints
│   ├── services/             # ML client & response generator
│   └── server.js
├── ml-service/               # Python NLP & ML Service
│   ├── data/                 # Training dataset (tickets.csv)
│   ├── preprocessing.py      # Stopword removal & tokenization
│   ├── predictor.py          # TF-IDF & Heuristic predictor
│   ├── train_model.py        # Scikit-learn training script
│   └── app.py                # Flask HTTP API
├── database/                 # MySQL 8.0 DDL & Seed Scripts
│   ├── schema.sql
│   └── seed.sql
├── docs/                     # Full Technical Documentation
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   └── viva.md
├── src/                      # React 19 Frontend
│   ├── components/           # Role dashboards, ML lab, SQL explorer
│   ├── services/             # API client & local fallback engine
│   └── types/                # TypeScript interfaces
└── README.md
```
