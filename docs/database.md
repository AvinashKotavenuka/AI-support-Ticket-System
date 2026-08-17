# Relational Database Documentation (MySQL 8.0)

## 1. Database Schema & Normalization (3NF)

The database `support_ticket_db` is designed following **Third Normal Form (3NF)**:
1. **1NF**: Every column contains atomic values, no repeating groups.
2. **2NF**: No partial dependency; all non-key attributes are fully functionally dependent on the primary key.
3. **3NF**: No transitive dependency; attributes depend only on the primary key, not on other non-key attributes.

## 2. Table Structures & Constraints

```text
┌─────────────────────────┐         ┌─────────────────────────┐
│          users          │         │         tickets         │
├─────────────────────────┤         ├─────────────────────────┤
│ id (PK)                 │◄───┐    │ id (PK)                 │
│ name                    │    │    │ user_id (FK -> users)   │───┐
│ email (UNIQUE)          │    └───┼│ assigned_agent (FK)     │   │
│ password (bcrypt)       │         │ title                   │   │
│ role (ENUM)             │         │ description             │   │
│ department              │         │ category (ENUM)         │   │
│ created_at              │         │ priority (ENUM)         │   │
└─────────────────────────┘         │ sentiment (ENUM)        │   │
             ▲                      │ status (ENUM)           │   │
             │                      │ suggested_response      │   │
             │                      │ created_at              │   │
             │                      │ updated_at              │   │
             │                      └─────────────────────────┘   │
             │                                   ▲                │
             │                                   │                │
             │        ┌──────────────────────────┘                │
             │        │                                           │
┌────────────┴────────┴───┐         ┌─────────────────────────────┴──┐
│    ticket_responses     │         │          ticket_notes          │
├─────────────────────────┤         ├────────────────────────────────┤
│ id (PK)                 │         │ id (PK)                        │
│ ticket_id (FK->tickets) │         │ ticket_id (FK -> tickets)      │
│ user_id (FK -> users)   │         │ agent_id (FK -> users)         │
│ message                 │         │ note                           │
│ is_internal_note (BOOL) │         │ created_at                     │
│ created_at              │         └────────────────────────────────┘
└─────────────────────────┘
```

## 3. Key Indexing Strategy

- `idx_user_email`: Fast $O(\log N)$ lookup during login and registration.
- `idx_ticket_status`, `idx_ticket_category`, `idx_ticket_priority`: Accelerates filtered queries in the support agent dashboard.
- `idx_ticket_user`, `idx_ticket_agent`: Optimizes customer ticket retrieval and agent workload calculations.
