-- Migration: Tunda auto-fix — audit log table + support_tickets status extension
-- Project: hvcmknveplxksufotmmu
-- Applied live via SQL editor 2026-07-17 (files-first per migrations/README.md).
--
-- Supports lib/tunda-autofix.ts. auto_fix_log is the immutable audit trail of every
-- automated diagnosis/repair; support_tickets gains an 'auto_resolved' status plus
-- auto_fix_status / auto_fixed_at so the review surface can distinguish auto- from
-- human-resolved tickets.

create table if not exists public.auto_fix_log (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.support_tickets(id) on delete set null,
  user_id uuid,
  matched_category text,
  outcome text not null,          -- fixed | would_fix | escalated | failed | skipped_dedup
  action_taken text,
  diagnosis jsonb,
  detail text,
  mode text,                      -- off | shadow | live
  created_at timestamptz not null default now()
);
create index if not exists auto_fix_log_ticket_idx on public.auto_fix_log(ticket_id);
create index if not exists auto_fix_log_created_idx on public.auto_fix_log(created_at desc);
alter table public.auto_fix_log enable row level security;
drop policy if exists "service_role_all_auto_fix_log" on public.auto_fix_log;
create policy "service_role_all_auto_fix_log" on public.auto_fix_log
  to service_role using (true) with check (true);

alter table public.support_tickets add column if not exists auto_fix_status text;
alter table public.support_tickets add column if not exists auto_fixed_at timestamptz;
alter table public.support_tickets drop constraint if exists support_tickets_status_check;
alter table public.support_tickets add constraint support_tickets_status_check
  check (status = any (array['open','resolved','escalated','auto_resolved']));

notify pgrst, 'reload schema';
