-- 1. Terms acceptance (legal consent timestamp) -----------------------------
alter table public.profiles
  add column if not exists terms_accepted_at timestamptz;

-- 2. RLS hardening -----------------------------------------------------------
-- Several earlier migrations created "service_role_write_*" / "service_role_*"
-- policies WITHOUT a `to service_role` clause. In Postgres/Supabase, a policy
-- created without an explicit `TO <role>` applies to PUBLIC — i.e. to every
-- role including `anon` and `authenticated`, not just the service role as the
-- name implied. That means any logged-in (or in some cases anonymous) user
-- could satisfy `USING (true) / WITH CHECK (true)` and write rows directly,
-- bypassing the API layer entirely. This migration drops and recreates those
-- policies scoped to `service_role` only, and tightens two policies that had
-- no ownership check at all on INSERT.

-- talent_badges
drop policy if exists service_role_write_talent_badges on public.talent_badges;
create policy service_role_write_talent_badges
  on public.talent_badges
  for all
  to service_role
  using (true)
  with check (true);

-- talent_capstone_work
drop policy if exists service_role_write_talent_capstone_work on public.talent_capstone_work;
create policy service_role_write_talent_capstone_work
  on public.talent_capstone_work
  for all
  to service_role
  using (true)
  with check (true);

-- job_postings
drop policy if exists service_role_write_job_postings on public.job_postings;
create policy service_role_write_job_postings
  on public.job_postings
  for all
  to service_role
  using (true)
  with check (true);

-- employer_bundles
drop policy if exists service_role_write_employer_bundles on public.employer_bundles;
create policy service_role_write_employer_bundles
  on public.employer_bundles
  for all
  to service_role
  using (true)
  with check (true);

-- pending_employer_unlock_orders
drop policy if exists service_role_write_pending_employer_unlock_orders on public.pending_employer_unlock_orders;
create policy service_role_write_pending_employer_unlock_orders
  on public.pending_employer_unlock_orders
  for all
  to service_role
  using (true)
  with check (true);

-- employer_unlocks
drop policy if exists service_role_write_employer_unlocks on public.employer_unlocks;
create policy service_role_write_employer_unlocks
  on public.employer_unlocks
  for all
  to service_role
  using (true)
  with check (true);

-- enrollments: the open "service_role_update_enrollments" policy let any
-- authenticated user UPDATE any enrollment row (including payment_status)
-- because it had no `to service_role` clause and no ownership check. This is
-- the most severe finding in the audit — restrict to service_role only.
drop policy if exists service_role_update_enrollments on public.enrollments;
create policy service_role_update_enrollments
  on public.enrollments
  for update
  to service_role
  using (true)
  with check (true);

-- grading_attempts: "service_role_insert_grading_attempts" allowed inserting
-- a fabricated attempt row for ANY user_id from any client. Restrict writes
-- to service_role only (the grading API routes use the service-role client).
drop policy if exists service_role_insert_grading_attempts on public.grading_attempts;
create policy service_role_insert_grading_attempts
  on public.grading_attempts
  for insert
  to service_role
  with check (true);

-- grading_cache: "service_role_write_grading_cache" was USING(true)/WITH
-- CHECK(true) with no role restriction, letting any user overwrite any
-- other user's cached grading result. Restrict to service_role only.
drop policy if exists service_role_write_grading_cache on public.grading_cache;
create policy service_role_write_grading_cache
  on public.grading_cache
  for all
  to service_role
  using (true)
  with check (true);

-- assessments: "select_assessments_public" exposed every user's assessment
-- scores/feedback to every other authenticated user regardless of talent-pool
-- opt-in, unlike the gated pattern used for talent_badges/talent_capstone_work.
-- Replace with an own-row-only select policy; public visibility of a user's
-- assessment results (if desired) should go through the talent_profiles /
-- talent_badges gated-visibility pattern instead.
drop policy if exists select_assessments_public on public.assessments;
create policy select_own_assessments
  on public.assessments
  for select
  to authenticated
  using (auth.uid() = user_id);

-- sim_daraja_transactions / sim_whatsapp_messages / grading_cache / grading_attempts
-- already have RLS enabled per earlier migrations; this migration does not
-- touch their already-correct own-row policies.
