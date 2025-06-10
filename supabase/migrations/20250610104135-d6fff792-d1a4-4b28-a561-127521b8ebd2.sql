
-- Enable RLS on clients table if not already enabled
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own client record" ON public.clients;
DROP POLICY IF EXISTS "Users can insert their own client record" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own client record" ON public.clients;

-- Create RLS policies for clients table
CREATE POLICY "Users can view their own client record" 
ON public.clients FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own client record" 
ON public.clients FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own client record" 
ON public.clients FOR UPDATE 
USING (auth.uid() = id);
