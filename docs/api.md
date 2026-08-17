# REST API Specification

Base URL: `http://localhost:5000/api`

## Authentication

### 1. Register
- **Endpoint**: `POST /auth/register`
- **Body**:
```json
{
  "name": "Alex Rivera",
  "email": "alex@customer.com",
  "password": "password123",
  "role": "customer",
  "department": "Customer"
}
```
- **Response** `201 Created`:
```json
{
  "success": true,
  "message": "Account registered successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "name": "Alex Rivera",
    "email": "alex@customer.com",
    "role": "customer"
  }
}
```

### 2. Login
- **Endpoint**: `POST /auth/login`
- **Body**:
```json
{
  "email": "sarah@support.com",
  "password": "password123"
}
```
- **Response** `200 OK`:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "name": "Sarah Jenkins",
    "email": "sarah@support.com",
    "role": "agent",
    "department": "Technical & Billing"
  }
}
```

---

## Tickets

### 3. Create Ticket (Customer)
- **Endpoint**: `POST /tickets`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "title": "Payment deducted but order failed",
  "description": "My bank card was charged $129 twice for order #ORD-9932."
}
```
- **Response** `201 Created`:
```json
{
  "success": true,
  "ticket": {
    "id": 101,
    "user_id": 4,
    "title": "Payment deducted but order failed",
    "category": "Billing",
    "priority": "High",
    "sentiment": "Negative",
    "status": "Open",
    "suggested_response": "We apologize for the billing issue...",
    "created_at": "2026-08-16T12:00:00Z"
  }
}
```

### 4. Get Tickets (Filtered)
- **Endpoint**: `GET /tickets?status=Open&priority=High&category=Billing`
- **Headers**: `Authorization: Bearer <token>`
- **Response** `200 OK`:
```json
{
  "success": true,
  "count": 1,
  "tickets": [...]
}
```

### 5. Update Status
- **Endpoint**: `PUT /tickets/:id/status`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "status": "Resolved" }`

### 6. Assign Agent
- **Endpoint**: `PUT /tickets/:id/assign`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ "agent_id": 2 }`

### 7. Add Response / Internal Note
- **Endpoint**: `POST /tickets/:id/responses`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
```json
{
  "message": "Initiated refund via Stripe merchant portal.",
  "is_internal_note": true
}
```

---

## Analytics

### 8. Dashboard Statistics
- **Endpoint**: `GET /dashboard/stats`
- **Headers**: `Authorization: Bearer <token>`
- **Response** `200 OK`:
```json
{
  "success": true,
  "stats": {
    "total_tickets": 25,
    "open_tickets": 5,
    "in_progress_tickets": 8,
    "resolved_tickets": 12,
    "high_priority_tickets": 7,
    "resolution_rate": 48,
    "category_distribution": [
      { "name": "Billing", "count": 8 },
      { "name": "Technical", "count": 7 }
    ]
  }
}
```
