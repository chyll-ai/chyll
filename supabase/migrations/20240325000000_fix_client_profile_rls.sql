-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.client_profile;
DROP POLICY IF EXISTS "Users can create own profile" ON public.client_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON public.client_profile;

-- Enable RLS
ALTER TABLE public.client_profile ENABLE ROW LEVEL SECURITY;

-- Create policies with proper UUID handling
CREATE POLICY "Users can view own profile"
ON public.client_profile
FOR SELECT
USING (auth.uid()::uuid = client_id::uuid);

CREATE POLICY "Users can create own profile"
ON public.client_profile
FOR INSERT
WITH CHECK (auth.uid()::uuid = client_id::uuid);

CREATE POLICY "Users can update own profile"
ON public.client_profile
FOR UPDATE
USING (auth.uid()::uuid = client_id::uuid);

-- Grant necessary permissions
GRANT ALL ON public.client_profile TO authenticated;

-- Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_client_profile_client_id ON public.client_profile(client_id);

-- Verify the table structure
DO $$ 
BEGIN
  -- Ensure client_id is UUID type
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'client_profile' 
    AND column_name = 'client_id' 
    AND data_type = 'uuid'
  ) THEN
    ALTER TABLE public.client_profile 
    ALTER COLUMN client_id TYPE uuid USING client_id::uuid;
  END IF;
END $$; 