
-- Add new columns to the leads table for enhanced PDL data
ALTER TABLE public.leads 
ADD COLUMN job_company_industry text,
ADD COLUMN job_company_size text,
ADD COLUMN job_seniority text,
ADD COLUMN job_company_website text,
ADD COLUMN github_url text,
ADD COLUMN twitter_url text,
ADD COLUMN facebook_url text,
ADD COLUMN experience_years integer,
ADD COLUMN headline text,
ADD COLUMN summary text,
ADD COLUMN skills jsonb,
ADD COLUMN languages jsonb,
ADD COLUMN education jsonb,
ADD COLUMN certifications jsonb;

-- Add index on commonly filtered fields for better performance
CREATE INDEX idx_leads_job_company_industry ON public.leads(job_company_industry);
CREATE INDEX idx_leads_job_company_size ON public.leads(job_company_size);
CREATE INDEX idx_leads_job_seniority ON public.leads(job_seniority);

-- Add GIN index for JSONB fields to enable efficient querying
CREATE INDEX idx_leads_skills_gin ON public.leads USING GIN(skills);
CREATE INDEX idx_leads_languages_gin ON public.leads USING GIN(languages);
CREATE INDEX idx_leads_education_gin ON public.leads USING GIN(education);
