-- Migration: add missing timestamp columns to progress table
-- Project: hvcmknveplxksufotmmu
-- Run at: https://supabase.com/dashboard/project/hvcmknveplxksufotmmu/sql
--
-- After fix_progress_add_course_slug.sql added course_slug, the upsert still fails
-- because the progress table is also missing completed_at and updated_at.
-- Error observed: PGRST204 "Could not find the 'updated_at' column of 'progress'"
--
-- Upsert payload sent by the app:
--   { user_id, course_slug, lesson_id, completed, completed_at, updated_at }
-- All of these must exist as columns.

-- Add completed_at (nullable — set when a lesson is marked complete)
ALTER TABLE public.progress
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Add updated_at (nullable — set on every write)
ALTER TABLE public.progress
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- Reload PostgREST schema cache immediately
NOTIFY pgrst, 'reload schema';
