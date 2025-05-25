-- Drop existing policies
DROP POLICY IF EXISTS "Users can only access their own client data" ON "public"."clients";
DROP POLICY IF EXISTS "Users can select their own client data" ON "public"."clients";
DROP POLICY IF EXISTS "Users can insert their own client data" ON "public"."clients";
DROP POLICY IF EXISTS "Users can update their own client data" ON "public"."clients";

-- Drop dependent tables first
DROP TABLE IF EXISTS "public"."messages" CASCADE;
DROP TABLE IF EXISTS "public"."conversations" CASCADE;
DROP TABLE IF EXISTS "public"."client_profile" CASCADE;

-- Drop and recreate the clients table
DROP TABLE IF EXISTS "public"."clients" CASCADE;
CREATE TABLE "public"."clients" (
    "id" uuid NOT NULL,
    "email" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT "clients_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "clients_email_key" UNIQUE ("email")
);

-- Enable RLS
ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;

-- Create policies for clients
CREATE POLICY "Enable read for authenticated users"
ON "public"."clients"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for authenticated users"
ON "public"."clients"
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for own data"
ON "public"."clients"
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Grant access to authenticated users
GRANT ALL ON "public"."clients" TO authenticated;
GRANT ALL ON "public"."clients" TO service_role;

-- Recreate conversations table
CREATE TABLE "public"."conversations" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "client_id" uuid NOT NULL REFERENCES "public"."clients"("id") ON DELETE CASCADE,
    "type" text NOT NULL,
    "title" text,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- Enable RLS on conversations
ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;

-- Create policies for conversations
CREATE POLICY "Enable read for authenticated users"
ON "public"."conversations"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for own conversations"
ON "public"."conversations"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

-- Grant access to conversations
GRANT ALL ON "public"."conversations" TO authenticated;
GRANT ALL ON "public"."conversations" TO service_role;

-- Recreate messages table
CREATE TABLE "public"."messages" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "conversation_id" uuid NOT NULL REFERENCES "public"."conversations"("id") ON DELETE CASCADE,
    "client_id" uuid NOT NULL REFERENCES "public"."clients"("id") ON DELETE CASCADE,
    "role" text NOT NULL,
    "content" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- Enable RLS on messages
ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
CREATE POLICY "Enable read for authenticated users"
ON "public"."messages"
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for own messages"
ON "public"."messages"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

-- Grant access to messages
GRANT ALL ON "public"."messages" TO authenticated;
GRANT ALL ON "public"."messages" TO service_role;
