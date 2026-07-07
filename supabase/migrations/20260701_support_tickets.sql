-- support_tickets table
-- Stores escalated support conversations from the Tunda chat widget.
-- Anonymous users (user_id NULL) are supported — only user_email is captured.

create table if not exists public.support_tickets (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  user_email    text,
  conversation  jsonb not null default '[]'::jsonb,
  issue_summary text,
  status        text not null default 'open'
                  check (status in ('open', 'resolved', 'escalated')),
  created_at    timestamptz not null default now()
);

-- Indexes
create index if not exists support_tickets_status_idx
  on public.support_tickets (status, created_at desc);

create index if not exists support_tickets_user_id_idx
  on public.support_tickets (user_id)
  where user_id is not null;

-- ── RLS ───────────────────────────────────────────────────────────────────────

alter table public.support_tickets enable row level security;

-- Service role bypasses RLS — needed for API routes that use the service key
create policy "service_role_all_support_tickets"
  on public.support_tickets
  to service_role
  using (true)
  with check (true);

-- Authenticated users can read their own tickets
create policy "users_read_own_tickets"
  on public.support_tickets
  for select
  to authenticated
  using (user_id = auth.uid());
