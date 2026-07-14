-- Migration: fix progress.lesson_id column type (uuid -> integer)
-- Project: hvcmknveplxksufotmmu
-- Run at: https://supabase.com/dashboard/project/hvcmknveplxksufotmmu/sql
--
-- The progress table was scaffolded with lesson_id as a uuid FK to lessons.id,
-- but lessons/courses were never populated (0 rows) -- all course content is
-- static, hardcoded in lib/course-content.ts, keyed by an integer lessonNumber.
-- The app has only ever sent lesson.lessonNumber (e.g. 0, 1, 2) as lesson_id,
-- so every upsert to progress fails with:
--   22P02 invalid input syntax for type uuid: "1"
--
-- SEVERITY: BLOCKER -- every student's lesson-completion write has silently
-- failed since the progress table was created. 0 rows in production.
--
-- Fix: drop lesson_id (CASCADE drops its FK to the unused lessons table and
-- the composite unique constraint that references it) and recreate it as
-- integer, matching lessonNumber. Table has 0 rows, so this is lossless.

ALTER TABLE public.progress DROP COLUMN lesson_id CASCADE;

ALTER TABLE public.progress ADD COLUMN lesson_id integer NOT NULL;

ALTER TABLE public.progress
  ADD CONSTRAINT progress_user_id_course_slug_lesson_id_key
  UNIQUE (user_id, course_slug, lesson_id);

-- Reload PostgREST schema cache immediately (no restart needed)
NOTIFY pgrst, 'reload schema';
