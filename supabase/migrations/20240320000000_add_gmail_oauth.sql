-- Enable the OAuth provider for Gmail
INSERT INTO auth.providers (provider_id, provider)
VALUES ('google', '{
  "enabled": true,
  "client_id": "{{ env.GOOGLE_CLIENT_ID }}",
  "client_secret": "{{ env.GOOGLE_CLIENT_SECRET }}",
  "redirect_uri": "{{ env.SITE_URL }}/auth/v1/callback",
  "scope": "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send email profile"
}')
ON CONFLICT (provider_id) DO UPDATE
SET provider = EXCLUDED.provider;

-- Update tokens table to include provider information and standardize OAuth fields
ALTER TABLE public.tokens
ADD COLUMN IF NOT EXISTS provider VARCHAR(50) DEFAULT 'google',
ADD COLUMN IF NOT EXISTS provider_token_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS scope TEXT[],
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tokens_updated_at
    BEFORE UPDATE ON public.tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 