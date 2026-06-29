-- CRITICAL FIX: talent_profiles is missing columns that every talent-system page
-- (dashboard/profile, /talent, /talent/[id], employer dashboard, match-talent API)
-- assumes exist. Confirmed via live PostgREST schema introspection on 2026-06-29 —
-- the live table only has: id, user_id, headline, bio, github_url, linkedin_url,
-- is_visible, updated_at, auto_bio, auto_headline, phone, availability,
-- self_reported_skills, self_reported_experience, self_reported_projects,
-- profile_complete, last_generated_at.
--
-- Missing: full_name, location, skills, years_experience, portfolio_url,
-- contact_email, contact_phone (the last two are also in create_employer_unlocks.sql —
-- run that migration too if it hasn't been applied).

alter table public.talent_profiles add column if not exists full_name text;
alter table public.talent_profiles add column if not exists location text;
alter table public.talent_profiles add column if not exists skills text[] default '{}'::text[];
alter table public.talent_profiles add column if not exists years_experience integer default 0;
alter table public.talent_profiles add column if not exists portfolio_url text;
alter table public.talent_profiles add column if not exists contact_email text;
alter table public.talent_profiles add column if not exists contact_phone text;

-- employer_bundles and pending_employer_unlock_orders were also confirmed MISSING
-- from the live database (create_employer_unlocks.sql never ran). Re-running that
-- file is idempotent (all "create table if not exists" / "add column if not exists"),
-- so it's safe to run in full after this file. Included here again for convenience:

create table if not exists public.employer_bundles (
  id                  uuid primary key default gen_random_uuid(),
  employer_id         uuid not null references auth.users(id) on delete cascade,
  profiles_remaining  integer not null default 0,
  expires_at          timestamptz not null,
  purchased_at        timestamptz not null default now(),
  unique (employer_id)
);

alter table public.employer_bundles enable row level security;

drop policy if exists "select_own_employer_bundles" on public.employer_bundles;
create policy "select_own_employer_bundles"
  on public.employer_bundles
  for select
  using (auth.uid() = employer_id);

drop policy if exists "service_role_write_employer_bundles" on public.employer_bundles;
create policy "service_role_write_employer_bundles"
  on public.employer_bundles
  for all
  using (true)
  with check (true);

create table if not exists public.pending_employer_unlock_orders (
  id                uuid primary key default gen_random_uuid(),
  order_tracking_id text not null unique,
  employer_id       uuid not null references auth.users(id) on delete cascade,
  unlock_type       text not null, -- 'single' | 'bundle'
  candidate_id      uuid references auth.users(id) on delete cascade,
  amount            integer not null,
  created_at        timestamptz not null default now()
);

alter table public.pending_employer_unlock_orders enable row level security;

drop policy if exists "select_own_pending_employer_unlock_orders" on public.pending_employer_unlock_orders;
create policy "select_own_pending_employer_unlock_orders"
  on public.pending_employer_unlock_orders
  for select
  using (auth.uid() = employer_id);

drop policy if exists "service_role_write_pending_employer_unlock_orders" on public.pending_employer_unlock_orders;
create policy "service_role_write_pending_employer_unlock_orders"
  on public.pending_employer_unlock_orders
  for all
  using (true)
  with check (true);
