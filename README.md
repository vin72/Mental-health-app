# Motivation Quotes MVP Monorepo

Production-minded MVP for a mobile motivation app that personalizes quotes using OpenAI through a FastAPI backend.

## Monorepo Structure

```text
.
├── mobile/          # Expo + React Native + TypeScript app
├── backend/         # FastAPI API
├── supabase/        # SQL migrations for schema + RLS
├── docs/            # architecture + endpoint contracts
├── scripts/         # helper scripts for setup checks
└── README.md
```

## What already works in this codebase
- Expo mobile app with screens for login, signup, home quote generation, favorites, history, preferences, and profile placeholder.
- FastAPI backend with health, profile, preferences, quote generation, history, favorites, and favorite-marking routes.
- Backend-only OpenAI integration (`backend/app/services/openai_service.py`).
- Supabase SQL migration with required tables and row-level security policies.

## 10-minute beginner setup

### 1) Create your Supabase project
1. Create a new Supabase project.
2. In Supabase SQL Editor, run: `supabase/migrations/202604040001_init.sql`.
3. In Supabase dashboard, copy:
   - Project URL
   - Anon key
   - Service role key

### 2) Fill env files (required)

Create `mobile/.env` from `mobile/.env.example`:
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Create `backend/.env` from `backend/.env.example`:
```env
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4.1-mini
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

### 3) Run setup checker (recommended)
```bash
python scripts/check_setup.py
```

### 4) Start backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
cp .env.example .env  # only if you still need it
uvicorn app.main:app --reload
```

### 5) Start mobile
```bash
cd mobile
npm install
cp .env.example .env  # only if you still need it
npm run start
```

## If something fails
- If backend says missing OpenAI key: set `OPENAI_API_KEY` in `backend/.env`.
- If backend says Supabase keys missing: set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `backend/.env`.
- If login fails in mobile: re-check Supabase URL + anon key in `mobile/.env`.

## Architecture
- **Mobile**: Expo Router, Supabase Auth, Zustand, React Hook Form + Zod.
- **Backend**: FastAPI, typed Pydantic schemas, service/repository separation.
- **DB/Auth**: Supabase Postgres + Supabase Auth.
- **AI**: OpenAI integration isolated to `backend/app/services/openai_service.py`.

## API and architecture docs
- `docs/api.md`
- `docs/architecture.md`

## TODOs / deferred production hardening
- Replace dummy middleware with distributed rate limiting (Redis).
- Add moderation API checks before generation.
- Add remote push notification pipeline.
- Add integration tests for API routes with mocked Supabase/OpenAI.
