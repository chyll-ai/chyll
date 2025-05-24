-- Drop existing tables if they exist
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS client_profile CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS tokens CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS queue_search CASCADE;

-- Create clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT
);

-- Create conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT,
    last_message_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chat_sessions table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    thread_id TEXT,
    assistant_id TEXT
);

-- Create messages table (simplified schema)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    toolCalls JSONB
);

-- Create client_profile table
CREATE TABLE client_profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
    company_name TEXT,
    industry TEXT,
    value_prop TEXT,
    icp_title TEXT,
    icp_location TEXT,
    icp_size TEXT,
    is_complete BOOLEAN DEFAULT false
);

-- Create leads table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    search_id UUID,
    full_name TEXT,
    job_title TEXT,
    company TEXT,
    location TEXT,
    email TEXT,
    linkedin_url TEXT,
    status TEXT DEFAULT 'new',
    notes TEXT
);

-- Create tokens table for OAuth
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    UNIQUE(client_id, provider)
);

-- Create api_keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_type TEXT UNIQUE NOT NULL,
    key_value TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Create activity_logs table
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    context JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create queue_search table
CREATE TABLE queue_search (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    keyword TEXT NOT NULL,
    parsed_filters JSONB,
    status TEXT DEFAULT 'pending',
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_messages_client_id ON messages(client_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_leads_client_id ON leads(client_id);
CREATE INDEX idx_leads_search_id ON leads(search_id);
CREATE INDEX idx_activity_logs_client_id ON activity_logs(client_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_queue_search_client_id ON queue_search(client_id);
CREATE INDEX idx_queue_search_status ON queue_search(status);

-- Add RLS (Row Level Security) policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_search ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON clients
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own conversations" ON conversations
    FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Users can view own chat sessions" ON chat_sessions
    FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Users can view own messages" ON messages
    FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Users can view own profile" ON client_profile
    FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Users can view own leads" ON leads
    FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Users can view own tokens" ON tokens
    FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Users can view own activity logs" ON activity_logs
    FOR ALL USING (auth.uid() = client_id);

CREATE POLICY "Users can view own searches" ON queue_search
    FOR ALL USING (auth.uid() = client_id);

-- Create function to update message toolcalls
CREATE OR REPLACE FUNCTION update_message_toolcalls(message_id UUID, tool_calls JSONB)
RETURNS void AS $$
BEGIN
    UPDATE messages
    SET toolCalls = tool_calls
    WHERE id = message_id
    AND client_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 