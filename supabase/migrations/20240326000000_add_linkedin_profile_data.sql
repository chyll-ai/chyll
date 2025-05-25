-- Add linkedin_profile_data column to leads table
ALTER TABLE leads
ADD COLUMN IF NOT EXISTS linkedin_profile_data JSONB DEFAULT NULL;

-- Update RLS policies to include the new column
ALTER POLICY "Users can view their own leads" ON leads
    USING (auth.uid() = client_id);

ALTER POLICY "Users can update their own leads" ON leads
    USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id); 