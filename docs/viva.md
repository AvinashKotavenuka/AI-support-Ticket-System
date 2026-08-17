# Placement Viva & Technical Interview Guide

## Category 1: Architecture & System Design

### Q1: Explain your project in 1 minute.
- **Simple Answer**: It is an AI-powered customer support ticket management and triage system that automatically reads incoming customer complaints, classifies their department (Billing, Tech, Account, etc.), evaluates priority and sentiment, and assists agents in resolving them quickly.
- **Technical Answer**: The application follows a 3-tier decoupled architecture with a React 19 frontend, an Express REST API backend, a MySQL 8.0 relational database in 3NF, and a Python Scikit-learn NLP microservice utilizing TF-IDF vectorization and Multinomial Logistic Regression.
- **10-Second Elevator Pitch**: *"A full-stack React-Node-MySQL triage system with a Python TF-IDF machine learning engine for real-time ticket categorization and sentiment analysis."*

---

## Category 2: Backend & Security

### Q2: What is JWT and why did you use it?
- **Technical Answer**: JSON Web Token (JWT) is a compact, URL-safe means of representing claims securely between client and server. We use HMAC-SHA256 signed tokens containing the user ID and role, allowing stateless authentication without server-side session stores.

### Q3: Why bcrypt for passwords?
- **Technical Answer**: bcrypt uses an adaptive key derivation function with automatic salting and configurable work factors ($2^{\text{cost}}$ iterations), making it computationally resistant to brute-force and rainbow table attacks.

---

## Category 3: Machine Learning & NLP

### Q4: What is TF-IDF and why did you choose it over Deep Learning?
- **Technical Answer**: TF-IDF (Term Frequency-Inverse Document Frequency) measures term relevance by balancing local frequency against global document rarity. For support ticket classification, TF-IDF coupled with Logistic Regression provides microsecond latency, zero GPU requirements, high interpretability, and robust performance on domain-specific keywords.

### Q5: How is sentiment calculated?
- **Technical Answer**: Using a transparent lexicon polarity scoring model ($\text{Score} = \text{Count}(\text{Positive Words}) - \text{Count}(\text{Negative Words})$). If negative words dominate, the ticket is flagged as Negative.
