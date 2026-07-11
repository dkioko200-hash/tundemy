-- Migration: create certificates table
-- Created: 2026-07-11
-- Formalizes the table created live in Supabase during testing.
-- Run this in any fresh environment (staging, local, new deploy) before the app starts.

CREATE TABLE IF NOT EXISTS public.certificates (
  id          uuid        NOT NULL DEFAULT gen_random_uuid(),
  cert_id     text        NOT NULL,
  user_id     uuid        NOT NULL,
  course_slug text        NOT NULL,
  full_name   text        NOT NULL,
  issued_at   timestamptz NOT NULL DEFAULT now(),
  created_at  timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT certificates_pkey                PRIMARY KEY (id),
  CONSTRAINT certificates_cert_id_key         UNIQUE (cert_id),
  CONSTRAINT certificates_user_id_course_slug_key UNIQUE (user_id, course_slug),
  CONSTRAINT certificates_user_id_fkey        FOREIGN KEY (user_id)
                                              REFERENCES auth.users (id)
                                              ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Anyone (including unauthenticated) can read certificates (for verify page)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'certificates' AND policyname = 'select_any_certificate'
  ) THEN
    CREATE POLICY select_any_certificate
      ON public.certificates
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- Only the service role may insert/update/delete certificates
-- NOTE: current live policy incorrectly grants this to public role.
-- The correct policy below restricts to service_role.
-- If upgrading an existing DB, drop the old policy first:
--   DROP POLICY IF EXISTS service_role_write_certificate ON public.certificates;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'certificates' AND policyname = 'service_role_write_certificate'
  ) THEN
    CREATE POLICY service_role_write_certificate
      ON public.certificates
      FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
