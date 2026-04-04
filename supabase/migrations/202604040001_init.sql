create extension if not exists pgcrypto;

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  primary_goal text not null,
  tone text not null,
  quote_length text not null default 'short',
  allow_spiritual boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.generated_quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prompt_context jsonb,
  quote_text text not null,
  category text,
  model_name text,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.generated_quotes enable row level security;

create policy "profiles_select_own" on public.user_profiles
for select to authenticated using (auth.uid() = id);

create policy "profiles_upsert_own" on public.user_profiles
for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "preferences_select_own" on public.user_preferences
for select to authenticated using (auth.uid() = user_id);

create policy "preferences_upsert_own" on public.user_preferences
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "quotes_select_own" on public.generated_quotes
for select to authenticated using (auth.uid() = user_id);

create policy "quotes_insert_own" on public.generated_quotes
for insert to authenticated with check (auth.uid() = user_id);

create policy "quotes_update_own" on public.generated_quotes
for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
