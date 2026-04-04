# Motivation Quotes MVP Monorepo

Production-minded MVP for a mobile motivation app that personalizes quotes using OpenAI through a FastAPI backend.

## Monorepo Structure

```text
.
├── mobile/          # Expo + React Native + TypeScript app
├── backend/         # FastAPI API
├── supabase/        # SQL migrations for schema + RLS
├── docs/            # architecture + endpoint contracts
└── README.md
```

## Architecture
- **Mobile**: Expo Router, Supabase Auth, Zustand, React Hook Form + Zod.
- **Backend**: FastAPI, typed Pydantic schemas, service/repository separation.
- **DB/Auth**: Supabase Postgres + Supabase Auth.
- **AI**: OpenAI integration isolated to `backend/app/services/openai_service.py`.

## MVP Decisions for Fast Delivery
- Backend uses Supabase admin API for token validation and table access to keep auth-aware behavior centralized.
- `QuoteService` includes explicit placeholders for quota/rate-limit/moderation hooks instead of fake full implementations.
- Profile screen is implemented as a functional placeholder with sign-out support.
- Daily reminder is a local notification scheduled at 9:00 AM device time.

## Environment Setup

### Required secret files
- `mobile/.env` (from `mobile/.env.example`)
- `backend/.env` (from `backend/.env.example`)

### Mobile `.env`
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Backend `.env`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

## Run Locally

### 1) Supabase
- Apply migration in `supabase/migrations/202604040001_init.sql` using Supabase SQL editor or CLI.

### 2) Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
cp .env.example .env
uvicorn app.main:app --reload
```

### 3) Mobile
```bash
cd mobile
npm install
cp .env.example .env
npm run start
```

## API and Architecture Docs
- `docs/api.md`
- `docs/architecture.md`

## TODOs / Deferred Items
- Replace dummy middleware with distributed rate limiting (Redis).
- Add moderation API checks pre-generation.
- Add remote push notification pipeline.
- Add profile editing and account deletion UX.
- Add integration tests for API routes with mocked Supabase/OpenAI.
