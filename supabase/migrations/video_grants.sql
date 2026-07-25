-- One-time video access grants.
-- Run in Supabase SQL editor (or via CLI migration).

create table if not exists public.video_grants (
  id          uuid primary key default gen_random_uuid(),
  token       text not null unique,
  video_path  text not null,
  email       text not null,
  used        boolean not null default false,
  used_at     timestamptz,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

create index if not exists video_grants_token_idx on public.video_grants (token);

-- Lock the table down: only the service role (server) may touch it.
alter table public.video_grants enable row level security;
-- No policies added => anon/authenticated clients get zero access.
-- The service role key bypasses RLS, which is what the API routes use.
