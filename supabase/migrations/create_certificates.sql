create table if not exists public.certificates (
  id              uuid primary key default gen_random_uuid(),
  cert_id         text not null unique,
  user_id         uuid not null references auth.users(id) on delete cascade,
  course_slug     text not null,
  full_name       text not null,
  issued_at       timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.certificates enable row level security;

-- Anyone can verify a certificate by its cert_id (public verification page)
create policy "select_any_certificate"
  on public.certificates
  for select
  using (true);

-- Users can insert their own certificate once earned
create policy "insert_own_certificate"
  on public.certificates
  for insert
  with check (auth.uid() = user_id);
