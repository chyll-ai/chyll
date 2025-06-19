
-- Add missing timestamp columns to email_jobs table
ALTER TABLE public.email_jobs 
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger to automatically update updated_at column
CREATE OR REPLACE FUNCTION update_email_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_email_jobs_updated_at_trigger
    BEFORE UPDATE ON public.email_jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_email_jobs_updated_at();
