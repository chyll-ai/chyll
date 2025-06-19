
-- Create email_jobs table for tracking email campaigns
CREATE TABLE IF NOT EXISTS public.email_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  lead_id UUID REFERENCES public.leads(id) NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  type TEXT DEFAULT 'cold_email' CHECK (type IN ('cold_email', 'followup_1', 'followup_2')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing columns to leads table for enrichment
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS linkedin_profile_data JSONB,
ADD COLUMN IF NOT EXISTS last_contact_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update leads status enum to include enrichment statuses
ALTER TABLE public.leads 
DROP CONSTRAINT IF EXISTS leads_status_check;

ALTER TABLE public.leads 
ADD CONSTRAINT leads_status_check 
CHECK (status IN (
  'new', 
  'enriching', 
  'enriched', 
  'contacted', 
  'responded', 
  'qualified', 
  'lost',
  'à contacter',
  'email envoyé',
  'répondu',
  'intéressé',
  'à relancer',
  'appel prévu',
  'rdv',
  'rdv manqué'
));

-- Create activity_logs table for tracking actions
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  action TEXT NOT NULL,
  context JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own email jobs" ON public.email_jobs
  FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Users can view their own activity logs" ON public.activity_logs
  FOR ALL USING (auth.uid() = client_id);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON public.leads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_jobs_updated_at 
  BEFORE UPDATE ON public.email_jobs 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
