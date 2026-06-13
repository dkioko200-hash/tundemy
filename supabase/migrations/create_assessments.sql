create table if not exists public.assessments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  track       text not null,
  score       integer not null,
  passed      boolean not null default false,
  feedback    jsonb,
  taken_at    timestamptz not null default now(),
  unique (user_id, track)
);

alter table public.assessments enable row level security;

-- Public read so the talent pool and profile pages can show verified tracks
create policy "select_assessments_public"
  on public.assessments
  for select
  using (true);

create policy "upsert_own_assessments"
  on public.assessments
  for insert
  with check (auth.uid() = user_id);

create policy "update_own_assessments"
  on public.assessments
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
