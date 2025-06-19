
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  client_id: string;
  toolCalls?: any[];
}

export interface Lead {
  id: string;
  client_id: string;
  full_name: string;
  job_title: string;
  company: string;
  location: string;
  email: string;
  phone_number: string;
  linkedin_url: string;
  github_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  job_company_industry?: string;
  job_company_size?: string;
  job_company_website?: string;
  job_seniority?: string;
  experience_years?: number;
  headline?: string;
  summary?: string;
  skills?: string; // JSON string
  languages?: string; // JSON string
  education?: string; // JSON string
  certifications?: string; // JSON string
  status: string;
  created_at: string;
  
  // Sales and Pipeline tracking fields
  mrr?: number;
  arr?: number;
  pipeline_stage?: string;
  close_probability?: number;
  expected_close_date?: string;
  last_activity_date?: string;
  
  // Extensive PDL fields
  job_start_date?: string;
  job_end_date?: string;
  job_duration_months?: number;
  job_description?: string;
  job_location?: string;
  job_company_linkedin_url?: string;
  job_company_twitter_url?: string;
  job_company_facebook_url?: string;
  job_company_founded_year?: number;
  job_company_employees_count?: number;
  job_company_revenue?: string;
  job_company_funding?: string;
  job_company_tags?: string; // JSON string
  personal_emails?: string; // JSON string
  work_email?: string;
  mobile_phone?: string;
  work_phone?: string;
  birth_year?: number;
  birth_date?: string;
  gender?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  time_zone?: string;
  interests?: string; // JSON string
  industry_experience?: string; // JSON string
  management_level?: string;
  departments?: string; // JSON string
  subdepartments?: string; // JSON string
  job_functions?: string; // JSON string
  job_history?: string; // JSON string
  education_history?: string; // JSON string
  degree_names?: string; // JSON string
  school_names?: string; // JSON string
  major_fields?: string; // JSON string
  graduation_dates?: string; // JSON string
  gpa_scores?: string; // JSON string
  honors?: string; // JSON string
  activities?: string; // JSON string
  societies?: string; // JSON string
  linkedin_connections?: number;
  linkedin_followers?: number;
  linkedin_premium?: boolean;
  linkedin_verified?: boolean;
  github_followers?: number;
  github_following?: number;
  github_repos?: number;
  twitter_followers?: number;
  twitter_following?: number;
  facebook_friends?: number;
  social_profiles?: string; // JSON string
  patents?: string; // JSON string
  publications?: string; // JSON string
  awards?: string; // JSON string
  volunteer_work?: string; // JSON string
  recommendations_received?: number;
  recommendations_given?: number;
  personality_traits?: string; // JSON string
  work_preferences?: string; // JSON string
  salary_range?: string;
  net_worth?: string;
  investment_interests?: string; // JSON string
  technology_skills?: string; // JSON string
  software_proficiency?: string; // JSON string
  programming_languages?: string; // JSON string
  databases_used?: string; // JSON string
  frameworks_used?: string; // JSON string
  cloud_platforms?: string; // JSON string
  project_management_tools?: string; // JSON string
  design_tools?: string; // JSON string
  marketing_tools?: string; // JSON string
  sales_tools?: string; // JSON string
  communication_tools?: string; // JSON string
  mobile_devices?: string; // JSON string
  operating_systems?: string; // JSON string
  browser_preferences?: string; // JSON string
  shopping_preferences?: string; // JSON string
  travel_preferences?: string; // JSON string
  lifestyle_interests?: string; // JSON string
  media_consumption?: string; // JSON string
  political_affiliation?: string;
  religious_beliefs?: string;
  family_status?: string;
  children_count?: number;
  pet_ownership?: string; // JSON string
  home_ownership?: string;
  vehicle_ownership?: string; // JSON string
  health_interests?: string; // JSON string
  fitness_activities?: string; // JSON string
  dietary_preferences?: string; // JSON string
  environmental_interests?: string; // JSON string
  
  enriched_from?: {
    source: string;
    timestamp: string;
    notes?: string;
  };
  linkedin_profile_data?: {
    headline?: string;
    summary?: string;
    experience?: string[];
    skills?: string[];
    education?: string[];
    languages?: string[];
    connections?: number;
    recommendations?: number;
  };
}

export interface AssistantState {
  loading: boolean;
  sending: boolean;
  isGenerating: boolean;
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  userId: string;
}
