-- Contact fields revealed only after an employer unlocks a profile
alter table public.talent_profiles add column if not exists contact_email text;
alter table public.talent_profiles add column if not exists contact_phone text;

-- One row per (employer, candidate) unlock — permanent once purchased
create table if not exists public.employer_unlocks (
  id            uuid primary key default gen_random_uuid(),
  employer_id   uuid not null references auth.users(id) on delete cascade,
  candidate_id  uuid not null references auth.users(id) on delete cascade,
  unlocked_at   timestamptz not null default now(),
  unique (employer_id, candidate_id)
);

alter table public.employer_unlocks enable row level security;

create policy "select_own_employer_unlocks"
  on public.employer_unlocks
  for select
  using (auth.uid() = employer_id);

create policy "service_role_write_employer_unlocks"
  on public.employer_unlocks
  for all
  using (true)
  with check (true);

-- Monthly bundle: KSh 30,000 unlocks 10 profiles, valid for 30 days
create table if not exists public.employer_bundles (
  id                  uuid primary key default gen_random_uuid(),
  employer_id         uuid not null references auth.users(id) on delete cascade,
  profiles_remaining  integer not null default 0,
  expires_at          timestamptz not null,
  purchased_at        timestamptz not null default now(),
  unique (employer_id)
);

alter table public.employer_bundles enable row level security;

create policy "select_own_employer_bundles"
  on public.employer_bundles
  for select
  using (auth.uid() = employer_id);

create policy "service_role_write_employer_bundles"
  on public.employer_bundles
  for all
  using (true)
  with check (true);

-- Tracks in-flight Pesapal orders for profile unlocks / bundles
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

create policy "select_own_pending_employer_unlock_orders"
  on public.pending_employer_unlock_orders
  for select
  using (auth.uid() = employer_id);

create policy "service_role_write_pending_employer_unlock_orders"
  on public.pending_employer_unlock_orders
  for all
  using (true)
  with check (true);
