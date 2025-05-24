-- Enable RLS
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;

-- Policy for tokens table - users can only access their own tokens
CREATE POLICY "Users can only access their own tokens"
ON public.tokens
FOR ALL
USING (client_id = auth.uid())
WITH CHECK (client_id = auth.uid());

-- Policy for clients table - users can only access their own data
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own client data"
ON public.clients
FOR ALL
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Ensure authenticated access only
ALTER TABLE public.tokens FORCE ROW LEVEL SECURITY;
ALTER TABLE public.clients FORCE ROW LEVEL SECURITY; 