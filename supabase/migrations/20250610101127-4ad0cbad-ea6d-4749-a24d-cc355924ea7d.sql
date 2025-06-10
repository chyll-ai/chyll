
-- Add indexes to improve query performance on the leads table
CREATE INDEX IF NOT EXISTS idx_leads_client_id ON public.leads (client_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_client_created ON public.leads (client_id, created_at DESC);

-- Also ensure the status column has a default value to prevent null issues
ALTER TABLE public.leads ALTER COLUMN status SET DEFAULT 'new';

-- Update any existing NULL status values
UPDATE public.leads SET status = 'new' WHERE status IS NULL;
