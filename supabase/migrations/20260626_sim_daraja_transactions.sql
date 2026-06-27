create table if not exists sim_daraja_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null, -- 'oauth' | 'stkpush' | 'callback' | 'query'
  checkout_request_id text,
  payload jsonb,
  response jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_sim_daraja_user on sim_daraja_transactions(user_id);
create index if not exists idx_sim_daraja_checkout on sim_daraja_transactions(checkout_request_id);
