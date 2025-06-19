
-- Remove the existing check constraint and create a more flexible one
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;

-- Add a more flexible check constraint that allows common status values
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check 
CHECK (status IN (
  'new', 'contacted', 'qualified', 'interested', 'archived',
  'nouveau', 'à contacter', 'email envoyé', 'à relancer', 
  'répondu', 'rdv', 'rdv manqué', 'prospect', 'proposal', 
  'negotiation', 'closed_won', 'closed_lost'
));
