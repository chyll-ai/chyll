-- Create tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.tokens (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    access_token text NOT NULL,
    refresh_token text,
    expires_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(client_id)
);

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can only access their own tokens" ON public.tokens;
DROP POLICY IF EXISTS "Users can manage their own tokens" ON public.tokens;
DROP POLICY IF EXISTS "Users can only access their own client data" ON public.clients;
DROP POLICY IF EXISTS "Users can select their own client data" ON public.clients;
DROP POLICY IF EXISTS "Users can insert their own client data" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own client data" ON public.clients;

-- Enable RLS
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create policies for tokens table
CREATE POLICY "Users can view their own tokens"
    ON public.tokens
    FOR SELECT
    USING (client_id = auth.uid());

CREATE POLICY "Users can insert their own tokens"
    ON public.tokens
    FOR INSERT
    WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own tokens"
    ON public.tokens
    FOR UPDATE
    USING (client_id = auth.uid());

CREATE POLICY "Users can delete their own tokens"
    ON public.tokens
    FOR DELETE
    USING (client_id = auth.uid());

-- Create policies for clients table
CREATE POLICY "Users can view their own profile"
    ON public.clients
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.clients
    FOR UPDATE
    USING (auth.uid() = id);

-- Policies for messages
CREATE POLICY "Users can view their own messages"
    ON public.messages
    FOR SELECT
    USING (client_id = auth.uid());

CREATE POLICY "Users can insert their own messages"
    ON public.messages
    FOR INSERT
    WITH CHECK (client_id = auth.uid());

CREATE POLICY "Users can update their own messages"
    ON public.messages
    FOR UPDATE
    USING (client_id = auth.uid());

CREATE POLICY "Users can delete their own messages"
    ON public.messages
    FOR DELETE
    USING (client_id = auth.uid());

-- Grant access to authenticated users
GRANT ALL ON public.tokens TO authenticated;
GRANT ALL ON public.clients TO authenticated;
GRANT ALL ON public.messages TO authenticated;

-- Force RLS on all tables
ALTER TABLE public.tokens FORCE ROW LEVEL SECURITY;
ALTER TABLE public.clients FORCE ROW LEVEL SECURITY;
ALTER TABLE public.messages FORCE ROW LEVEL SECURITY; 