-- Migration: create missing user_badges table
-- Project: hvcmknveplxksufotmmu
-- Run at: https://supabase.com/dashboard/project/hvcmknveplxksufotmmu/sql
--
-- STATUS: ALREADY APPLIED LIVE (2026-07-14, via the Supabase SQL editor).
--
-- UNEXPECTED FINDING during badge work: the user_badges table did not exist
-- in production at all, even though the app reads it on the dashboard and
-- certificates pages and writes to it when an assessment is passed
-- (app/assessment/[track]/page.tsx). Every one of those queries failed
-- silently (42P01) behind Promise.allSettled, so no user could ever earn or
-- see a badge. Same class of schema drift as the progress table fixes.
--
-- Schema matches app usage: upsert on (user_id, badge_name), fields
-- badge_name + earned_at read by the UI.

create table if not exists public.user_badges (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    badge_name text not null,
    earned_at timestamptz not null default now(),
    constraint user_badges_user_id_badge_name_key unique (user_id, badge_name)
  );

alter table public.user_badges enable row level security;

create policy "Users can view own badges" on public.user_badges
  for select using (auth.uid() = user_id);

create policy "Users can insert own badges" on public.user_badges
  for insert with check (auth.uid() = user_id);

create policy "Users can update own badges" on public.user_badges
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Reload PostgREST schema cache immediately
NOTIFY pgrst, 'reload schema';
