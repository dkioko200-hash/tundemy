-- Migration: fix schema drift found in full audit (2026-07-15 overnight)
-- Project: hvcmknveplxksufotmmu
-- Run at: https://supabase.com/dashboard/project/hvcmknveplxksufotmmu/sql
--
-- STATUS: ALREADY APPLIED LIVE (2026-07-15, via the Supabase SQL editor).
-- Verified after applying: 5/5 new tables present, 12/12 new columns present,
-- 20 RLS policies across the touched tables. All altered tables had 0 rows at
-- time of change (verified), so every change below is lossless.
--
-- Full audit of live information_schema vs every supabase-js call in the app:
-- 1. assessments: app upserts { user_id, track, score, passed, feedback,
--    taken_at } with onConflict user_id,track. Live had track_id (not track),
--    no taken_at, feedback as text, no unique constraint, and RLS SELECT only
--    -> every assessment save silently failed (and with it the badge award
--    and talent-profile chain in app/assessment/[track]/page.tsx).
-- 2. talent_profiles: app upserts a track column that did not exist; RLS had
--    SELECT only while the assessment page upserts client-side.
-- 3. profiles: dashboard reads completion_percentage / profile_views;
--    settings write title / job_type. None existed (dashboard always showed
--    the hardcoded 35% default).
-- 4. contact_requests: whole table missing (employer contact flow +
--    student inbox at /dashboard/contact-requests were dead).
-- 5. activity_log: whole table missing (dashboard Recent Activity always
--    empty). NOTE: nothing writes to it yet -- separate product gap.
-- 6. sandbox_submissions: whole table missing (/dashboard/sandbox history
--    always empty). NOTE: nothing writes to it yet -- separate product gap.
-- 7. employer_profiles: whole table missing; live had legacy employers table
--    (0 rows) with different columns.
-- 8. job_applications: missing employer_id + cover_note, and had RLS enabled
--    with ZERO policies (all client access blocked). Also see companion code
--    fix: the page embedded job_posts(title), the table is job_postings.
-- 9. pending_employer_unlock_orders: pesapal unlock routes write
--    candidate_id / order_tracking_id / unlock_type; live had talent_user_id /
--    bundle_id / pesapal_reference. Columns added; legacy columns left.
-- 10. support_tickets: repo migration 20260701_support_tickets.sql was
--    committed on Jul 1 but never applied live. Applied verbatim here.
--
-- NOT touched (flagged for human review in the overnight report):
-- - Legacy orphan tables badges, jobs, employers, courses, lessons (all 0
--   rows, unreferenced or superseded) -- recommend dropping in a follow-up
--   migration after confirmation.
-- - Legacy columns assessments.track_id/submission/status,
--   pending_employer_unlock_orders.talent_user_id/bundle_id/pesapal_reference.

-- 1. assessments
alter table public.assessments add column if not exists track text;
alter table public.assessments add column if not exists taken_at timestamptz;
alter table public.assessments alter column feedback type jsonb using feedback::jsonb;
alter table public.assessments add constraint assessments_user_id_track_key unique (user_id, track);
-- legacy NOT NULL columns the app never sends -> would still block every insert
alter table public.assessments alter column track_id drop not null;
alter table public.assessments alter column submission drop not null;
create policy "Users can insert own assessments" on public.assessments
  for insert with check (auth.uid() = user_id);
create policy "Users can update own assessments" on public.assessments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 2. talent_profiles
alter table public.talent_profiles add column if not exists track text;
create policy "Users can insert own talent profile" on public.talent_profiles
  for insert with check (auth.uid() = user_id);
create policy "Users can update own talent profile" on public.talent_profiles
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. profiles
alter table public.profiles add column if not exists completion_percentage integer not null default 35;
alter table public.profiles add column if not exists profile_views integer not null default 0;
alter table public.profiles add column if not exists title text;
alter table public.profiles add column if not exists job_type text;

-- 4. contact_requests
create table if not exists public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.profiles(id) on delete cascade,
  candidate_id uuid not null references public.profiles(id) on delete cascade,
  employer_name text,
  role_title text not null,
  role_type text,
  budget_range text,
  message text,
  status text not null default 'pending',
  responded_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.contact_requests enable row level security;
create policy "Employers can create contact requests" on public.contact_requests
  for insert with check (auth.uid() = employer_id);
create policy "Participants can view contact requests" on public.contact_requests
  for select using (auth.uid() = candidate_id or auth.uid() = employer_id);
create policy "Candidates can respond to contact requests" on public.contact_requests
  for update using (auth.uid() = candidate_id) with check (auth.uid() = candidate_id);

-- 5. activity_log
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  description text,
  created_at timestamptz not null default now()
);
alter table public.activity_log enable row level security;
create policy "Users can view own activity" on public.activity_log
  for select using (auth.uid() = user_id);
create policy "Users can insert own activity" on public.activity_log
  for insert with check (auth.uid() = user_id);

-- 6. sandbox_submissions
create table if not exists public.sandbox_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_slug text not null,
  lesson_id integer,
  prompt text,
  score integer,
  submitted_at timestamptz not null default now()
);
alter table public.sandbox_submissions enable row level security;
create policy "Users can view own sandbox submissions" on public.sandbox_submissions
  for select using (auth.uid() = user_id);
create policy "Users can insert own sandbox submissions" on public.sandbox_submissions
  for insert with check (auth.uid() = user_id);

-- 7. employer_profiles
create table if not exists public.employer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  company_name text,
  company_size text,
  industry text,
  website text,
  description text,
  hq_location text,
  contact_email text,
  updated_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.employer_profiles enable row level security;
create policy "Users manage own employer profile" on public.employer_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 8. job_applications
alter table public.job_applications add column if not exists employer_id uuid references public.profiles(id) on delete cascade;
alter table public.job_applications add column if not exists cover_note text;
create policy "Employers can view applications to their jobs" on public.job_applications
  for select using (auth.uid() = employer_id);
create policy "Employers can update application status" on public.job_applications
  for update using (auth.uid() = employer_id) with check (auth.uid() = employer_id);
create policy "Students can view own applications" on public.job_applications
  for select using (auth.uid() = student_id);
create policy "Students can create own applications" on public.job_applications
  for insert with check (auth.uid() = student_id);

-- 9. pending_employer_unlock_orders
alter table public.pending_employer_unlock_orders add column if not exists candidate_id uuid;
alter table public.pending_employer_unlock_orders add column if not exists order_tracking_id text;
alter table public.pending_employer_unlock_orders add column if not exists unlock_type text;

-- 10. support_tickets (repo migration 20260701_support_tickets.sql, applied late)
create table if not exists public.support_tickets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  user_email    text,
  conversation  jsonb not null default '[]'::jsonb,
  issue_summary text,
  status        text not null default 'open'
                  check (status in ('open', 'resolved', 'escalated')),
  created_at    timestamptz not null default now()
);
create index if not exists support_tickets_status_idx
  on public.support_tickets (status, created_at desc);
create index if not exists support_tickets_user_id_idx
  on public.support_tickets (user_id)
  where user_id is not null;
alter table public.support_tickets enable row level security;
create policy "service_role_all_support_tickets" on public.support_tickets
  to service_role using (true) with check (true);
create policy "users_read_own_tickets" on public.support_tickets
  for select to authenticated using (user_id = auth.uid());

-- Reload PostgREST schema cache immediately
NOTIFY pgrst, 'reload schema';
