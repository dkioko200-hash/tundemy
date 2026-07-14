-- Migration: add missing INSERT/UPDATE RLS policies to progress table
-- Project: hvcmknveplxksufotmmu
-- Run at: https://supabase.com/dashboard/project/hvcmknveplxksufotmmu/sql
--
-- STATUS: ALREADY APPLIED LIVE (2026-07-14, via the Supabase SQL editor during
-- verification of fix_progress_lesson_id_type.sql). This file codifies that
-- manual change so the repo and database stay in sync.
--
-- The progress table had RLS enabled but only a SELECT policy
-- ("Users can view own progress"). Every client-side upsert was denied with
-- 403 / 42501 "new row violates row-level security policy for table progress",
-- previously masked by the lesson_id uuid type error (22P02).
--
-- Fix: allow authenticated users to insert/update ONLY their own rows.

create policy "Users can insert own progress"
  on public.progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.progress
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Reload PostgREST schema cache immediately
NOTIFY pgrst, 'reload schema';
