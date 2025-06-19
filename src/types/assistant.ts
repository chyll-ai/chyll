
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
  enriched_from?: {
    source: string;
    timestamp: string;
    notes?: string;
  };
  email_jobs?: {
    status: string;
    sent_at: string;
    subject: string;
    body: string;
  }[];
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
