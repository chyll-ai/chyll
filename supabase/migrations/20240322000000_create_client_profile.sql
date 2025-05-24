-- Create client_profile table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.client_profile (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    company_name TEXT,
    industry TEXT,
    value_prop TEXT,
    icp_title TEXT,
    icp_location TEXT,
    icp_size TEXT,
    common_objections TEXT,
    banned_phrases TEXT,
    calendly_url TEXT,
    is_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_profile_client_id ON public.client_profile(client_id);
CREATE INDEX IF NOT EXISTS idx_client_profile_is_complete ON public.client_profile(is_complete);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_client_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_client_profile_updated_at
    BEFORE UPDATE ON public.client_profile
    FOR EACH ROW
    EXECUTE FUNCTION update_client_profile_updated_at(); 