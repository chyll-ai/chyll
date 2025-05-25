-- Create client_profile table if it doesn't exist
CREATE TABLE IF NOT EXISTS client_profile (
  id UUID DEFAULT gen_random_uuid() NOT NULL,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  company_name TEXT,
  industry TEXT,
  value_prop TEXT,
  icp_title TEXT,
  icp_location TEXT,
  icp_size TEXT,
  is_complete BOOLEAN DEFAULT false,
  banned_phrases TEXT,
  calendly_url TEXT,
  common_objections TEXT,
  linkedin_url TEXT,
  offer TEXT,
  primary_goal TEXT,
  tone TEXT,
  CONSTRAINT client_profile_pkey PRIMARY KEY (id)
);

-- Enable RLS on client_profile
ALTER TABLE client_profile ENABLE ROW LEVEL SECURITY;

-- Create policies for client_profile
CREATE POLICY "Enable read for own profile"
ON client_profile
FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Enable insert for own profile"
ON client_profile
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Enable update for own profile"
ON client_profile
FOR UPDATE
TO authenticated
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

-- Grant access to client_profile
GRANT ALL ON client_profile TO authenticated;
GRANT ALL ON client_profile TO service_role;

-- Insert client first
INSERT INTO auth.users (id, email)
VALUES (
  'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
  'demo@example.com'
);

INSERT INTO public.clients (id, email)
VALUES (
  'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
  'demo@example.com'
);

-- Insert sample client profile
INSERT INTO public.client_profile (
  client_id,
  company_name,
  industry,
  value_prop,
  icp_title,
  icp_location,
  icp_size,
  is_complete,
  banned_phrases,
  calendly_url,
  common_objections,
  linkedin_url,
  offer,
  primary_goal,
  tone
) VALUES (
  'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
  'Tech Innovators Inc.',
  'SaaS',
  'Nous aidons les entreprises à se développer grâce à des solutions logicielles innovantes',
  'CTO, Directeur Technique, Head of Engineering',
  'France',
  'pme',
  true,
  'pas intéressé, trop cher, pas maintenant',
  'https://calendly.com/tech-innovators',
  'Budget limité, Déjà une solution en place, Timing pas optimal',
  'https://linkedin.com/company/tech-innovators',
  'Solution SaaS complète pour l''automatisation des processus métier',
  'Augmenter l''efficacité opérationnelle des PME françaises',
  'professionnel mais amical'
);

-- Create leads table if it doesn't exist
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  job_title TEXT,
  company TEXT,
  location TEXT,
  email TEXT NOT NULL,
  linkedin_url TEXT,
  status TEXT DEFAULT 'à contacter',
  phone_number TEXT,
  enriched_from JSONB,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(client_id, email),
  FOREIGN KEY (client_id) REFERENCES auth.users(id)
);

-- Enable RLS on leads
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies for leads
CREATE POLICY "Enable read for own leads"
ON leads
FOR SELECT
TO authenticated
USING (auth.uid() = client_id);

CREATE POLICY "Enable insert for own leads"
ON leads
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Enable update for own leads"
ON leads
FOR UPDATE
TO authenticated
USING (auth.uid() = client_id)
WITH CHECK (auth.uid() = client_id);

-- Grant access to leads
GRANT ALL ON leads TO authenticated;
GRANT ALL ON leads TO service_role;

-- Insert dummy leads
INSERT INTO public.leads (client_id, full_name, job_title, company, location, email, linkedin_url, status)
VALUES
  (
    'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
    'Sophie Martin',
    'CTO',
    'Digital Solutions SA',
    'Paris, France',
    'sophie.martin@example.com',
    'https://linkedin.com/in/sophie-martin',
    'à contacter'
  ),
  (
    'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
    'Thomas Bernard',
    'Head of Technology',
    'InnoTech SARL',
    'Lyon, France',
    'thomas.bernard@example.com',
    'https://linkedin.com/in/thomas-bernard',
    'contacté'
  ),
  (
    'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
    'Marie Dubois',
    'Director of Engineering',
    'TechForward',
    'Bordeaux, France',
    'marie.dubois@example.com',
    'https://linkedin.com/in/marie-dubois',
    'à contacter'
  ),
  (
    'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
    'Pierre Leroy',
    'CTO',
    'StartupFlow',
    'Nantes, France',
    'pierre.leroy@example.com',
    'https://linkedin.com/in/pierre-leroy',
    'intéressé'
  ),
  (
    'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
    'Claire Moreau',
    'Technical Director',
    'DataTech Solutions',
    'Marseille, France',
    'claire.moreau@example.com',
    'https://linkedin.com/in/claire-moreau',
    'à contacter'
  ); 