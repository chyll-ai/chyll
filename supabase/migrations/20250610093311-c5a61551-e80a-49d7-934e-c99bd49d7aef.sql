
-- First, let's standardize the leads table schema to match what the application expects
-- Update the status column to use consistent values and add missing constraints

-- Update any existing leads with the old status values to the new standardized ones
UPDATE public.leads 
SET status = CASE 
  WHEN status = 'Statut' THEN 'new'
  WHEN status IS NULL THEN 'new'
  ELSE status
END;

-- Make sure the status column has a proper default
ALTER TABLE public.leads 
ALTER COLUMN status SET DEFAULT 'new';

-- Add proper foreign key constraint for client_id referencing auth.users
ALTER TABLE public.leads 
DROP CONSTRAINT IF EXISTS leads_client_id_fkey;

ALTER TABLE public.leads 
ADD CONSTRAINT leads_client_id_fkey 
FOREIGN KEY (client_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Enable RLS on leads table if not already enabled
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can insert their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can update their own leads" ON public.leads;
DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;

-- Create proper RLS policies for leads
CREATE POLICY "Users can view their own leads" 
ON public.leads FOR SELECT 
USING (auth.uid() = client_id);

CREATE POLICY "Users can insert their own leads" 
ON public.leads FOR INSERT 
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own leads" 
ON public.leads FOR UPDATE 
USING (auth.uid() = client_id);

CREATE POLICY "Users can delete their own leads" 
ON public.leads FOR DELETE 
USING (auth.uid() = client_id);

-- Enable realtime for leads table
ALTER TABLE public.leads REPLICA IDENTITY FULL;

-- Add leads table to realtime publication if not already added
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' 
        AND tablename = 'leads'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
    END IF;
END $$;
