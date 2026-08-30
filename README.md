# Revenue Reconciliation Dashboard

A full-stack web application that ingests order and payment datasets, reconciles records deterministically, identifies discrepancies, and provides AI-powered explanations to help finance and operations teams investigate revenue issues.

## Live Demo

Frontend:
https://reconciliation-dashboard-lyart.vercel.app/

Backend:
https://reconciliation-dashboard-leca.onrender.com

---

## Overview

Businesses often maintain separate systems for orders and payments. In theory, every completed order should have a matching payment of the correct amount. In practice, discrepancies occur due to missing payments, refunds, duplicate transactions, processing errors, and data inconsistencies.

This application allows users to:

- Upload order and payment CSV files
- Store data securely in a database
- Run deterministic reconciliation logic
- Identify revenue-impacting discrepancies
- View dashboard metrics and charts
- Drill down into individual issues
- Generate AI-powered explanations and recommendations

---

## Architecture

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Recharts

### Backend

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- Prisma ORM

### Database

- PostgreSQL (Neon)

### AI Integration

- Google Gemini API

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon

---

## Authentication

The application uses JWT-based authentication.

Features:

- User registration
- User login
- Password hashing using bcrypt
- Protected API routes
- User-specific data isolation

Each user only has access to their own uploaded datasets and reconciliation results.

---

## Data Ingestion

Users upload:

### orders.csv

Contains:

- order_id
- order_date
- customer_email
- currency
- gross_amount
- discount
- net_amount
- status

### payments.csv

Contains:

- transaction_ref
- processed_at
- order_reference
- currency
- amount
- fee
- net_settled
- type
- status

Uploaded data is parsed and stored in PostgreSQL.

---

# Reconciliation Logic

The reconciliation engine is completely deterministic.

No LLM is used for matching records.

## Matching Rule

An order and payment are matched using:

```text
order.orderRef === payment.orderRef
```

---

## Discrepancy Types

### 1. Missing Payment

Condition:

```text
Order exists
Payment does not exist
```

Business Impact:

Revenue may not have been collected.

Risk Amount:

```text
Order Amount
```

---

### 2. Amount Mismatch

Condition:

```text
Order Amount != Payment Amount
```

Business Impact:

Incorrect charge amount.

Risk Amount:

```text
Absolute Difference
```

---

### 3. Orphan Payment

Condition:

```text
Payment exists
Matching Order does not exist
```

Business Impact:

Potential duplicate charge or data issue.

Risk Amount:

```text
Payment Amount
```

---

### 4. Full Refund

Condition:

```text
Payment Type = refund
Refund Amount = Original Amount
```

Business Impact:

Revenue completely reversed.

Risk Amount:

```text
Refund Amount
```

---

### 5. Partial Refund

Condition:

```text
Payment Type = refund
Refund Amount < Original Amount
```

Business Impact:

Partial revenue loss.

Risk Amount:

```text
Refund Amount
```

---

## Dashboard Features

### Summary Metrics

Displays:

- Total Orders
- Total Payments
- Total Reconciled Value
- Total Value In Dispute
- Money At Risk

---

### Charts

#### Discrepancy Breakdown

Visual representation of discrepancy counts by type.

#### Risk Distribution

Displays financial exposure by discrepancy category.

---

### Investigation Queue

Searchable and filterable table containing:

- Order Reference
- Discrepancy Type
- Order Amount
- Payment Amount
- Risk Amount

Users can drill into individual discrepancies.

---

## AI Integration

The application uses Google Gemini to explain discrepancies.

### Purpose

The LLM does not perform reconciliation.

Instead it:

- Explains likely causes
- Summarizes issues
- Suggests investigation steps
- Assigns severity

### Why Not Use AI For Matching?

The assignment requires deterministic and repeatable reconciliation.

Using an LLM for matching would introduce:

- Non-deterministic behavior
- Inconsistent results
- Difficult auditing

Therefore:

```text
Matching = Deterministic Logic

Explanation = AI
```

---

## Prompting Strategy

Gemini receives structured discrepancy information and is instructed to return JSON:

```json
{
  "summary": "",
  "likelyCause": "",
  "recommendedAction": "",
  "severity": ""
}
```

The backend validates and parses responses before sending them to the frontend.

---

## Temperature Choice

Temperature:

```text
0.2
```

Reason:

The objective is consistency and reliability rather than creativity.

Lower temperature produces:

- More stable responses
- Less hallucination
- Better repeatability

---

## Error Handling

Implemented:

- Invalid login handling
- Unauthorized access protection
- CSV upload validation
- Missing file validation
- AI service failure handling
- Loading states
- Empty state handling

---

## Findings From Dataset

The uploaded datasets contained multiple forms of reconciliation issues including:

- Orders without corresponding payments
- Payments without corresponding orders
- Amount mismatches
- Full refunds
- Partial refunds

Business impact includes:

- Potential revenue leakage
- Incorrect customer charges
- Reporting inaccuracies
- Financial reconciliation delays

---

## Running Locally

### Clone Repository

```bash
git clone <repository-url>
```

---

### Backend

```bash
cd backend

npm install
```

Create:

```env
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
```

Run migrations:

```bash
npx prisma db push
```

Start server:

```bash
npm run dev
```

---

### Frontend

```bash
cd frontend

npm install
```

Create:

```env
VITE_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

---

## Environment Variables

### Backend

```env
DATABASE_URL=
JWT_SECRET=
GEMINI_API_KEY=
```

### Frontend

```env
VITE_API_URL=
```

---

## Screenshots

### Register Page

<img width="1004" height="629" alt="image" src="https://github.com/user-attachments/assets/219164ca-3e5d-4922-987c-d9b5f48f9e8f" />


### Login page

<img width="1082" height="688" alt="image" src="https://github.com/user-attachments/assets/e1b80300-1b82-4645-b46c-f1a86557e705" />


### Uploading Page

<img width="651" height="685" alt="image" src="https://github.com/user-attachments/assets/a24539fc-a437-4edd-974b-64c9440ae3ad" />

<img width="1099" height="694" alt="image" src="https://github.com/user-attachments/assets/a3db1a58-dcb3-4647-8cc4-1f022bbfc732" />


### Loading Page

<img width="506" height="402" alt="image" src="https://github.com/user-attachments/assets/298d03c0-2980-405b-b527-cf656149f502" />


### Dashboard Page

<img width="920" height="618" alt="image" src="https://github.com/user-attachments/assets/52dc5663-103a-4842-a56f-959b6f676231" />


### Investigation Queue

<img width="839" height="248" alt="image" src="https://github.com/user-attachments/assets/65e2c0be-5ae1-4a2a-ab1f-d2cdd4526dc2" />


### AI Analysis

<img width="718" height="544" alt="image" src="https://github.com/user-attachments/assets/6ba18329-7a80-4fd7-9f3c-4a8af5671bac" />


---


## Future Improvements

Given more time, I would add:


- Reconciliation history
- Audit logs
- Bulk exports (CSV/PDF)
- Scheduled reconciliation jobs
- User roles and permissions
- Cached AI explanations
- Advanced analytics dashboard

---

## AI Tool Usage

AI-assisted development tools were used to accelerate implementation and improve productivity.

AI was used for:

- Code generation assistance
- UI improvements
- Debugging support
- Documentation drafting

All code was reviewed, tested, and understood before inclusion in the final solution.

---
