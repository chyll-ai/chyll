-- Drop existing table if exists
DROP TABLE IF EXISTS public.client_profile CASCADE;

-- Create client_profile table
CREATE TABLE public.client_profile (
  id UUID DEFAULT gen_random_uuid() NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  company_name TEXT,
  industry TEXT,
  value_prop TEXT,
  icp_title TEXT,
  icp_location TEXT,
  icp_size TEXT,
  is_complete BOOLEAN DEFAULT false,
  banned_phrases TEXT,
  calendly_url TEXT,
  common_objections TEXT,
  linkedin_url TEXT,
  offer TEXT,
  primary_goal TEXT,
  tone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT client_profile_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.client_profile ENABLE ROW LEVEL SECURITY;

-- Create policies for client_profile
CREATE POLICY "Enable read for own profile"
ON public.client_profile
FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Enable insert for own profile"
ON public.client_profile
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Enable update for own profile"
ON public.client_profile
FOR UPDATE
TO authenticated
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

-- Grant access
GRANT ALL ON public.client_profile TO authenticated;
GRANT ALL ON public.client_profile TO service_role;

-- Create index
CREATE INDEX idx_client_profile_is_complete ON public.client_profile USING btree (is_complete); 