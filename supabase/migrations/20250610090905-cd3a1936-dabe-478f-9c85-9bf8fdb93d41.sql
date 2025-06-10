
-- First, let's check if there are any existing foreign key constraints on the messages table
-- and update the messages table to handle the client_id properly

-- Remove the existing foreign key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'messages_client_id_fkey' 
        AND table_name = 'messages'
    ) THEN
        ALTER TABLE public.messages DROP CONSTRAINT messages_client_id_fkey;
    END IF;
END $$;

-- Add a new foreign key constraint that references auth.users instead
-- This way messages can be linked directly to authenticated users
ALTER TABLE public.messages 
ADD CONSTRAINT messages_client_id_fkey 
FOREIGN KEY (client_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Also ensure the clients table has proper constraints
-- Remove existing constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'clients_id_fkey' 
        AND table_name = 'clients'
    ) THEN
        ALTER TABLE public.clients DROP CONSTRAINT clients_id_fkey;
    END IF;
END $$;

-- Add foreign key constraint to clients table referencing auth.users
ALTER TABLE public.clients 
ADD CONSTRAINT clients_id_fkey 
FOREIGN KEY (id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;
