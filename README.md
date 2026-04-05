# MindWell - Mental Health Companion

A full-stack mental health tracking application built with React, Express, and SQLite.

## Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Mood Tracking** - Log your daily mood (1-5 scale) with optional notes
- **Mood Analytics** - Visualize mood trends over 7/14/30 days with interactive charts
- **Journal** - Write, edit, and organize private journal entries
- **Resource Library** - Curated mental health resources organized by category
- **Crisis Support** - Always-visible emergency contact information

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Recharts |
| Backend | Node.js, Express |
| Database | SQLite (via better-sqlite3) |
| Auth | JWT + bcrypt |

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### Running the App

```bash
# Terminal 1 - Start the backend (port 3001)
cd backend && npm run dev

# Terminal 2 - Start the frontend (port 5173)
cd frontend && npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
Mental-health-app/
├── backend/
│   ├── src/
│   │   ├── index.js          # Express server entry
│   │   ├── database.js       # SQLite setup & migrations
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT authentication middleware
│   │   └── routes/
│   │       ├── auth.js       # Login, register, profile
│   │       ├── mood.js       # Mood CRUD + analytics
│   │       ├── journal.js    # Journal CRUD
│   │       └── resources.js  # Resource library
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.tsx          # App entry point
│   │   ├── App.tsx           # Router & layout
│   │   ├── api.ts            # API client
│   │   ├── index.css         # Global styles
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── CrisisBar.tsx
│   │   │   └── MoodChart.tsx
│   │   └── pages/
│   │       ├── Login.tsx
│   │       ├── Register.tsx
│   │       ├── Dashboard.tsx
│   │       ├── MoodTracker.tsx
│   │       ├── Journal.tsx
│   │       └── Resources.tsx
│   └── package.json
└── README.md
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Get profile |
| POST | /api/mood | Yes | Log mood |
| GET | /api/mood | Yes | List mood entries |
| GET | /api/mood/stats | Yes | Mood analytics |
| DELETE | /api/mood/:id | Yes | Delete mood entry |
| POST | /api/journal | Yes | Create journal entry |
| GET | /api/journal | Yes | List journal entries |
| GET | /api/journal/:id | Yes | Get journal entry |
| PUT | /api/journal/:id | Yes | Update journal entry |
| DELETE | /api/journal/:id | Yes | Delete journal entry |
| GET | /api/resources | No | List resources |
| GET | /api/resources/categories | No | List categories |
