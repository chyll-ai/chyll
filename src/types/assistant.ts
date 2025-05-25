export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  client_id: string;
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