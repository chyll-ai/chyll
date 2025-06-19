
-- Add sales and pipeline tracking fields to the leads table (without deal_size)
ALTER TABLE public.leads 
ADD COLUMN mrr DECIMAL(15,2),
ADD COLUMN arr DECIMAL(15,2),
ADD COLUMN pipeline_stage TEXT DEFAULT 'prospect',
ADD COLUMN close_probability INTEGER CHECK (close_probability >= 0 AND close_probability <= 100),
ADD COLUMN expected_close_date DATE,
ADD COLUMN last_activity_date DATE DEFAULT CURRENT_DATE;

-- Add comments to document the new fields
COMMENT ON COLUMN public.leads.mrr IS 'Monthly recurring revenue in dollars';
COMMENT ON COLUMN public.leads.arr IS 'Annual recurring revenue in dollars';
COMMENT ON COLUMN public.leads.pipeline_stage IS 'Current stage in the sales pipeline';
COMMENT ON COLUMN public.leads.close_probability IS 'Probability of closing the deal (0-100%)';
COMMENT ON COLUMN public.leads.expected_close_date IS 'Expected date to close the deal';
COMMENT ON COLUMN public.leads.last_activity_date IS 'Date of last sales activity';
