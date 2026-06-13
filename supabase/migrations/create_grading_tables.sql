-- Tracks every grading API call for rate limiting (max 3 per user per course per 24h)
create table if not exists public.grading_attempts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  course_slug     text not null,
  kind            text not null, -- 'capstone' | 'assessment'
  submission_hash text not null,
  created_at      timestamptz not null default now()
);

create index if not exists grading_attempts_user_course_idx
  on public.grading_attempts (user_id, course_slug, kind, created_at);

alter table public.grading_attempts enable row level security;

create policy "select_own_grading_attempts"
  on public.grading_attempts
  for select
  using (auth.uid() = user_id);

create policy "service_role_insert_grading_attempts"
  on public.grading_attempts
  for insert
  with check (true);

-- Caches graded results so identical resubmissions don't re-call the Claude API
create table if not exists public.grading_cache (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  course_slug     text not null,
  kind            text not null, -- 'capstone' | 'assessment'
  submission_hash text not null,
  result          jsonb not null,
  created_at      timestamptz not null default now(),
  unique (user_id, course_slug, kind, submission_hash)
);

alter table public.grading_cache enable row level security;

create policy "select_own_grading_cache"
  on public.grading_cache
  for select
  using (auth.uid() = user_id);

create policy "service_role_write_grading_cache"
  on public.grading_cache
  for all
  using (true)
  with check (true);
