-- Drop existing table if exists
DROP TABLE IF EXISTS public.leads CASCADE;

-- Create leads table
CREATE TABLE public.leads (
  id UUID DEFAULT gen_random_uuid() NOT NULL,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  job_title TEXT,
  company TEXT,
  location TEXT,
  email TEXT,
  phone_number TEXT,
  linkedin_url TEXT,
  linkedin_profile_data JSONB,  -- Stores additional LinkedIn profile information
  status TEXT DEFAULT 'à contacter',
  notes TEXT,
  last_contact_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT leads_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies for leads
CREATE POLICY "Enable read for own leads"
ON public.leads
FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Enable insert for own leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Enable update for own leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Enable delete for own leads"
ON public.leads
FOR DELETE
TO authenticated
USING (auth.uid() = client_id);

-- Grant access
GRANT ALL ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

-- Create indexes
CREATE INDEX idx_leads_client_id ON public.leads USING btree (client_id);
CREATE INDEX idx_leads_status ON public.leads USING btree (status);
CREATE INDEX idx_leads_company ON public.leads USING btree (company);
CREATE INDEX idx_leads_last_contact_date ON public.leads USING btree (last_contact_date);
CREATE INDEX idx_leads_linkedin_profile ON public.leads USING gin (linkedin_profile_data);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 