# LedgerSCFO Compliance Tracker

A full-stack compliance tracking application for managing client-wise tasks, due dates, and completion status.

## 1) Project Title

**LedgerSCFO Compliance Tracker**

## 2) Live Demo Link (Frontend)

- Frontend: https://ledgerscfo-compliance-app.vercel.app/
- Deployed API: https://ledgerscfo-compliance-app.onrender.com

## 3) Features

- Client-wise compliance dashboard
- Task creation and status updates (Pending/Completed)
- Overdue highlighting and task summaries
- Search, filter, and due-date sorting
- Seed script for sample dataset

## 4) Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)

## 5) Project Structure

```text
ledgerscfo-compliance-app/
├─ client/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ pages/
│  │  └─ services/
├─ server/
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  ├─ services/
│  ├─ utils/
│  ├─ seed.js
│  └─ server.js
└─ README.md
```

## 6) Setup Instructions

### Backend (`server`)

1. Create `server/.env`:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

2. Install dependencies and run:

```bash
cd server
npm install
npm run dev
```

3. (Optional) Seed sample data:

```bash
npm run seed
```

### Frontend (`client`)

1. Create `client/.env` (optional override):

```env
VITE_API_BASE_URL=https://ledgerscfo-compliance-app.onrender.com
```

2. Install dependencies and run:

```bash
cd client
npm install
npm run dev
```

## 7) API Endpoints

Base URL: `https://ledgerscfo-compliance-app.onrender.com`

- `GET /` → API health check
- `GET /clients` → list all clients
- `GET /tasks/:clientId` → list tasks for a client
- `POST /tasks` → create task
- `PATCH /tasks/:id/status` → update task status

### Sample `POST /tasks` body

```json
{
  "title": "GST Filing",
  "description": "File monthly GST return",
  "category": "Tax",
  "dueDate": "2026-04-30T00:00:00.000Z",
  "clientId": "<client_object_id>",
  "priority": "High"
}
```

## 8) Assumptions

- Each task belongs to exactly one client.
- Task status is limited to `Pending` or `Completed`.
- Due date is required at task creation.
- Frontend consumes the REST API directly.

## 9) Tradeoffs

- Prioritized clean modular architecture over advanced auth/roles.
- No background jobs/reminder engine in MVP.
- Minimal validation/UI complexity for faster delivery.

## 10) Future Improvements

- Authentication and role-based access control
- File attachments and compliance document vault
- Notifications/reminders (email/WhatsApp)
- Audit logs and activity history
- Pagination and server-side filtering for scale
