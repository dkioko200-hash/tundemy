-- WhatsApp simulator session storage
CREATE TABLE IF NOT EXISTS public.sim_whatsapp_messages (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id  text        NOT NULL,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type text       NOT NULL,
  payload     jsonb       NOT NULL DEFAULT '{}',
  response    jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE public.sim_whatsapp_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert own sim messages"
  ON public.sim_whatsapp_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users read own sim messages"
  ON public.sim_whatsapp_messages FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
