
-- Insert 5 dummy leads for testing
INSERT INTO public.leads (
  client_id,
  full_name,
  job_title,
  company,
  location,
  email,
  phone_number,
  linkedin_url,
  status,
  enriched_from
) VALUES
(
  'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
  'Marie Leblanc',
  'Directrice Technique',
  'TechFlow Solutions',
  'Paris, France',
  'marie.leblanc@techflow.fr',
  '+33 6 12 34 56 78',
  'https://linkedin.com/in/marie-leblanc-tech',
  'new',
  '{"source": "manual_insert", "timestamp": "2024-12-10T10:00:00Z"}'
),
(
  'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
  'Alexandre Dupont',
  'CTO',
  'DataSpark Analytics',
  'Lyon, France',
  'alexandre.dupont@dataspark.fr',
  '+33 6 23 45 67 89',
  'https://linkedin.com/in/alexandre-dupont-cto',
  'contacted',
  '{"source": "manual_insert", "timestamp": "2024-12-10T10:00:00Z"}'
),
(
  'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
  'Julie Moreau',
  'Head of Engineering',
  'CloudFirst Technologies',
  'Toulouse, France',
  'julie.moreau@cloudfirst.fr',
  '+33 6 34 56 78 90',
  'https://linkedin.com/in/julie-moreau-engineering',
  'interested',
  '{"source": "manual_insert", "timestamp": "2024-12-10T10:00:00Z"}'
),
(
  'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
  'Thomas Girard',
  'Lead Developer',
  'InnovateLab',
  'Bordeaux, France',
  'thomas.girard@innovatelab.fr',
  '+33 6 45 67 89 01',
  'https://linkedin.com/in/thomas-girard-dev',
  'new',
  '{"source": "manual_insert", "timestamp": "2024-12-10T10:00:00Z"}'
),
(
  'a34eed60-ba41-43bb-af7a-7afd8e2e26c2',
  'Camille Bernard',
  'Product Manager',
  'SmartScale SAS',
  'Nice, France',
  'camille.bernard@smartscale.fr',
  '+33 6 56 78 90 12',
  'https://linkedin.com/in/camille-bernard-pm',
  'follow_up',
  '{"source": "manual_insert", "timestamp": "2024-12-10T10:00:00Z"}'
);
