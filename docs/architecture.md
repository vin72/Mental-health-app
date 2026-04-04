# Architecture Overview

## Monorepo
- `mobile/`: Expo React Native app with Expo Router.
- `backend/`: FastAPI API with service + repository layers.
- `supabase/`: SQL migrations and RLS policy definitions.
- `docs/`: API contract and architecture notes.

## Auth Flow
1. Mobile logs users in via Supabase Auth.
2. Mobile sends Supabase access token to backend as Bearer token.
3. Backend validates token via Supabase admin client.
4. Backend uses resolved `user.id` for all database actions.

## Quote Generation Flow
1. Mobile posts generation input to `/quotes/generate`.
2. Backend loads user preferences.
3. Prompt builder composes constrained system/user prompts.
4. OpenAI service calls OpenAI model.
5. Quote service stores quote in `generated_quotes` and returns typed response.

## Control Layer Hooks
- Middleware placeholder for rate-limiting (`DummyRateLimitMiddleware`).
- Quota placeholder in `QuoteService.generate`.
- Structured logging hooks in generation flow.
- TODO points for moderation checks.
