-- Phase 2 migration: AI-generated talent profiles, badges, capstone showcase,
-- and employer job postings.
--
-- Notes:
-- * Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- * Everything is idempotent (IF NOT EXISTS / OR REPLACE) so it's safe to re-run.
-- * "talent_unlocks" already exists functionally as `employer_unlocks`
--   (see create_employer_unlocks.sql) — app code in this build targets that
--   table directly rather than creating a duplicate.

-- ============================================================
-- 1. talent_profiles — new columns for AI-generated content
-- ============================================================
alter table public.talent_profiles add column if not exists auto_bio text;
alter table public.talent_profiles add column if not exists auto_headline text;
alter table public.talent_profiles add column if not exists phone text;
alter table public.talent_profiles add column if not exists availability text not null default 'available';
alter table public.talent_profiles add column if not exists self_reported_skills text[] not null default '{}';
alter table public.talent_profiles add column if not exists self_reported_experience jsonb not null default '[]';
alter table public.talent_profiles add column if not exists self_reported_projects jsonb not null default '[]';
alter table public.talent_profiles add column if not exists profile_complete boolean not null default false;
alter table public.talent_profiles add column if not exists last_generated_at timestamptz;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'talent_profiles_availability_check'
  ) then
    alter table public.talent_profiles
      add constraint talent_profiles_availability_check
      check (availability in ('available', 'open_to_offers', 'not_available'));
  end if;
end $$;

-- ============================================================
-- 2. talent_badges — one row per course/skill badge earned
-- ============================================================
create table if not exists public.talent_badges (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  course_slug  text not null,
  badge_name   text not null,
  icon         text,
  awarded_at   timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.talent_badges enable row level security;

drop policy if exists "select_own_talent_badges" on public.talent_badges;
create policy "select_own_talent_badges"
  on public.talent_badges for select
  using (auth.uid() = user_id);

drop policy if exists "select_public_talent_badges" on public.talent_badges;
create policy "select_public_talent_badges"
  on public.talent_badges for select
  using (
    exists (
      select 1 from public.talent_profiles tp
      where tp.user_id = talent_badges.user_id
        and tp.profile_complete = true
        and tp.is_visible = true
    )
  );

drop policy if exists "service_role_write_talent_badges" on public.talent_badges;
create policy "service_role_write_talent_badges"
  on public.talent_badges for all
  using (true) with check (true);

-- ============================================================
-- 3. talent_capstone_work — AI-written capstone summaries for the
--    public profile ("what they built", not "what they completed")
-- ============================================================
create table if not exists public.talent_capstone_work (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  course_slug   text not null,
  title         text not null,
  summary       text not null,
  score         integer,
  completed_at  timestamptz not null default now(),
  unique (user_id, course_slug)
);

alter table public.talent_capstone_work enable row level security;

drop policy if exists "select_own_talent_capstone_work" on public.talent_capstone_work;
create policy "select_own_talent_capstone_work"
  on public.talent_capstone_work for select
  using (auth.uid() = user_id);

drop policy if exists "select_public_talent_capstone_work" on public.talent_capstone_work;
create policy "select_public_talent_capstone_work"
  on public.talent_capstone_work for select
  using (
    exists (
      select 1 from public.talent_profiles tp
      where tp.user_id = talent_capstone_work.user_id
        and tp.profile_complete = true
        and tp.is_visible = true
    )
  );

drop policy if exists "service_role_write_talent_capstone_work" on public.talent_capstone_work;
create policy "service_role_write_talent_capstone_work"
  on public.talent_capstone_work for all
  using (true) with check (true);

-- ============================================================
-- 4. job_postings — employer-created job listings
-- ============================================================
create table if not exists public.job_postings (
  id                uuid primary key default gen_random_uuid(),
  employer_id       uuid not null references auth.users(id) on delete cascade,
  title             text not null,
  description       text not null,
  required_skills   text[] not null default '{}',
  job_type          text not null default 'full_time',
  experience_level  text not null default 'mid',
  location          text,
  salary_min        integer,
  salary_max        integer,
  deadline          date,
  status            text not null default 'active',
  applicants_count  integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.job_postings enable row level security;

drop policy if exists "select_own_job_postings" on public.job_postings;
create policy "select_own_job_postings"
  on public.job_postings for select
  using (auth.uid() = employer_id);

drop policy if exists "select_active_job_postings" on public.job_postings;
create policy "select_active_job_postings"
  on public.job_postings for select
  using (status = 'active');

drop policy if exists "manage_own_job_postings" on public.job_postings;
create policy "manage_own_job_postings"
  on public.job_postings for all
  using (auth.uid() = employer_id)
  with check (auth.uid() = employer_id);

drop policy if exists "service_role_write_job_postings" on public.job_postings;
create policy "service_role_write_job_postings"
  on public.job_postings for all
  using (true) with check (true);

create index if not exists job_postings_employer_id_idx on public.job_postings(employer_id);
create index if not exists job_postings_status_idx on public.job_postings(status);
