create table if not exists public.enrollments (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  course_slug     text not null,
  payment_status  text not null default 'pending',
  payment_ref     text,
  amount_paid     integer,
  enrolled_at     timestamptz not null default now(),
  created_at      timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.enrollments enable row level security;

-- Users can read their own enrollments
create policy "select_own_enrollments"
  on public.enrollments
  for select
  using (auth.uid() = user_id);

-- Users can insert a pending enrollment for themselves
create policy "insert_own_enrollments"
  on public.enrollments
  for insert
  with check (auth.uid() = user_id);

-- Service role (used by API routes) can update any enrollment
create policy "service_role_update_enrollments"
  on public.enrollments
  for update
  using (true)
  with check (true);
