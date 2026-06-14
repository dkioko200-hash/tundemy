-- Fix enrollments unique constraint to match (user_id, course_slug)
alter table public.enrollments drop constraint if exists enrollments_user_course_unique;
alter table public.enrollments add constraint enrollments_user_course_unique unique (user_id, course_slug);
