# API Contracts

Base URL: `http://localhost:8000`
Auth: `Authorization: Bearer <supabase_access_token>` for all endpoints except `/health`.

## GET /health
Returns `{ "status": "ok" }`.

## GET /me
Returns authenticated user profile and preferences.

## PUT /me/preferences
Body:
```json
{
  "primary_goal": "discipline",
  "tone": "practical",
  "quote_length": "short",
  "allow_spiritual": false
}
```

## POST /quotes/generate
Body:
```json
{
  "category": "discipline",
  "mood": "anxious",
  "context": "optional"
}
```
Returns generated quote record.

## GET /quotes/history
Returns all authenticated user's generated quotes ordered newest first.

## GET /quotes/favorites
Returns favorite quotes ordered newest first.

## POST /quotes/{quote_id}/favorite
Marks a quote as favorite and returns `{ "success": true }`.
