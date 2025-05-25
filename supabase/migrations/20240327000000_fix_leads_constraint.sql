-- Drop existing constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE table_name = 'leads' 
        AND constraint_type = 'UNIQUE'
    ) THEN
        ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_client_id_email_key;
    END IF;
END $$;

-- Add the constraint with an explicit name
ALTER TABLE leads ADD CONSTRAINT leads_client_id_email_key UNIQUE (client_id, email); 