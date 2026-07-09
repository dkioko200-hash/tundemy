-- Fix: grading_attempts table was created without course_slug column.
-- Run this once in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/hvcmknveplxksufotmmu/sql

ALTER TABLE public.grading_attempts
  ADD COLUMN IF NOT EXISTS course_slug text NOT NULL DEFAULT 'unknown';

-- Backfill existing rows (if any) already have 'unknown' from the DEFAULT above.
-- Drop the default so future inserts must supply a real slug.
ALTER TABLE public.grading_attempts
  ALTER COLUMN course_slug DROP DEFAULT;

-- Recreate index to include course_slug (idempotent)
DROP INDEX IF EXISTS grading_attempts_user_course_idx;
CREATE INDEX IF NOT EXISTS grading_attempts_user_course_idx
  ON public.grading_attempts (user_id, course_slug, kind, created_at);
