-- Fix: sim_daraja_transactions has row level security enabled (likely via project
-- default) but was missing the INSERT/SELECT policies that sim_whatsapp_messages
-- has. This caused every STK Push insert to fail with:
--   "new row violates row-level security policy for table sim_daraja_transactions" (42501)
-- which made the Daraja STK Push sandbox lesson permanently time out waiting for
-- a callback that could never be written to the table.

ALTER TABLE public.sim_daraja_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own sim daraja transactions"
  ON public.sim_daraja_transactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own sim daraja transactions"
  ON public.sim_daraja_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
