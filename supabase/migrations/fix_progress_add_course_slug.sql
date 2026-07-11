-- Migration: add course_slug column to progress table
-- Project: hvcmknveplxksufotmmu
-- Run at: https://supabase.com/dashboard/project/hvcmknveplxksufotmmu/sql
--
-- The progress table was created without course_slug, causing all lesson-completion
-- upserts and selects to fail with HTTP 400 in production. This adds the missing
-- column, backfills existing rows with a placeholder, enforces NOT NULL, and adds
-- the unique constraint required for upsert(onConflict:"user_id,course_slug,lesson_id").
--
-- SEVERITY: BLOCKER — every student's lesson progress silently fails to persist
-- on every page reload since the column is missing from PostgREST's schema cache.

-- Step 1: Add column with temporary default so existing rows satisfy NOT NULL
ALTER TABLE public.progress
  ADD COLUMN IF NOT EXISTS course_slug text NOT NULL DEFAULT 'unknown';

-- Step 2: Drop the default — future inserts must supply a real slug
ALTER TABLE public.progress
  ALTER COLUMN course_slug DROP DEFAULT;

-- Step 3: Add the UNIQUE constraint the upsert conflict key depends on
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'progress_user_id_course_slug_lesson_id_key'
      AND conrelid = 'public.progress'::regclass
  ) THEN
    ALTER TABLE public.progress
      ADD CONSTRAINT progress_user_id_course_slug_lesson_id_key
      UNIQUE (user_id, course_slug, lesson_id);
  END IF;
END $$;

-- Step 4: Index for the per-course progress queries
CREATE INDEX IF NOT EXISTS progress_user_course_idx
  ON public.progress (user_id, course_slug, completed);

-- Step 5: Reload PostgREST schema cache immediately (no restart needed)
NOTIFY pgrst, 'reload schema';
