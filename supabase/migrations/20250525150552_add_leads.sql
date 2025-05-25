-- Create leads table
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  client_id uuid references auth.users(id),
  full_name text not null,
  job_title text,
  company text,
  location text,
  email text not null,
  phone_number text,
  linkedin_url text,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  enriched_from jsonb,
  linkedin_profile_data jsonb,
  unique(client_id, email)
);

-- Drop existing publication if it exists
drop publication if exists supabase_realtime;

-- Create a new publication for realtime with all operations enabled
create publication supabase_realtime for table leads with (publish = 'insert,update,delete');

-- Enable row level security
alter table leads enable row level security;

-- Create policy for realtime
create policy "Enable realtime for authenticated users" on leads
  for all
  to authenticated
  using (auth.uid() = client_id); 