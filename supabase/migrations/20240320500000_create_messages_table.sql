-- Drop existing messages table if it exists
DROP TABLE IF EXISTS public.messages;

-- Create simplified messages table
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    conversation_id UUID NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    toolCalls JSONB
);

-- Add basic indexes
CREATE INDEX idx_messages_client_id ON public.messages(client_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id); 