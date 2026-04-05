# Motivation Quotes MVP Monorepo

Production-minded MVP for a mobile motivation app that personalizes quotes using OpenAI through a FastAPI backend.

## If you just want to launch it (copy/paste)
Open **two terminal windows** at the repo root.

### Terminal 1 (backend)
```bash
cp backend/.env.example backend/.env
./scripts/start_backend.sh
```

### Terminal 2 (mobile)
```bash
cp mobile/.env.example mobile/.env
./scripts/start_mobile.sh
```

Expo will print a QR code. Scan it with **Expo Go** on your phone to open the app.

---

## First-time setup (important)
Before launching, edit these files and paste real keys:
- `backend/.env`
- `mobile/.env`

You can run:
```bash
python scripts/check_setup.py
```
It tells you exactly what is missing.

## Required env values

### `mobile/.env`
```env
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### `backend/.env`
```env
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4.1-mini
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
```

## Supabase DB step (do once)
Run this SQL in Supabase SQL editor:
- `supabase/migrations/202604040001_init.sql`

## Useful shortcuts
```bash
make setup-env      # copy env templates if missing
make check          # validate env files
make run-backend    # start backend
make run-mobile     # start mobile app
```

## What already works in this codebase
- Expo mobile app with login, signup, home generation, favorites, history, preferences, profile placeholder.
- FastAPI backend routes: health, me, preferences, generate, history, favorites, favorite.
- Backend-only OpenAI integration and Supabase-backed persistence.
- Supabase SQL migration with RLS policies.

## Troubleshooting
- **"OPENAI_API_KEY is not configured"**: set `OPENAI_API_KEY` in `backend/.env`.
- **"SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing"**: fill those keys in `backend/.env`.
- **Expo cannot connect to backend from phone**: set `EXPO_PUBLIC_API_URL` to your computer LAN IP, e.g. `http://192.168.1.20:8000`.
