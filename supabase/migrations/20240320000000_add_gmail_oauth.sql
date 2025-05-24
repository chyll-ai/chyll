-- Update tokens table to include provider information and standardize OAuth fields
ALTER TABLE public.tokens
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'google',
ADD COLUMN IF NOT EXISTS provider_token_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS scope TEXT[],
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add a trigger to update the updated_at timestamp if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'update_tokens_updated_at'
  ) THEN
    CREATE TRIGGER update_tokens_updated_at
    BEFORE UPDATE ON public.tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql'; 