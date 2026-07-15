-- Migration: drop legacy orphan tables and leftover legacy columns
-- Project: hvcmknveplxksufotmmu
-- Applied live via SQL editor 2026-07-16 (CLI db push not yet available; see migrations/README.md).
--
-- Pre-drop verification (all confirmed this session):
--   * Row counts: badges=0, jobs=0, employers=0, courses=0, lessons=0.
--   * No .from()/embedded-relation references to any of the 5 tables in app/lib/components.
--   * All 6 leftover columns unreferenced in code.
-- Two FKs from LIVE (surviving) tables pointed into the legacy tables and are
-- dropped first so the table drops don't need to rely on CASCADE side effects:
--   enrollments_course_id_fkey     (enrollments.course_id -> courses)
--   job_applications_job_id_fkey   (job_applications.job_id -> jobs)
-- The enrollments.course_id / job_applications.job_id COLUMNS are intentionally
-- LEFT in place (app uses course_slug and relates applications to job_postings);
-- only the dead FK constraints are removed. Flagged in the report as a possible
-- future cleanup.

alter table public.enrollments drop constraint if exists enrollments_course_id_fkey;
alter table public.job_applications drop constraint if exists job_applications_job_id_fkey;

drop table if exists public.badges cascade;
drop table if exists public.jobs cascade;
drop table if exists public.employers cascade;
drop table if exists public.courses cascade;
drop table if exists public.lessons cascade;

-- Leftover nullable legacy columns (made nullable during the 2026-07-15 audit,
-- unreferenced by the app; now removed).
alter table public.assessments drop column if exists track_id;
alter table public.assessments drop column if exists submission;
alter table public.assessments drop column if exists status;
alter table public.pending_employer_unlock_orders drop column if exists talent_user_id;
alter table public.pending_employer_unlock_orders drop column if exists bundle_id;
alter table public.pending_employer_unlock_orders drop column if exists pesapal_reference;

NOTIFY pgrst, 'reload schema';
