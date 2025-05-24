export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface EmailJob {
  id: string;
  client_id: string;
  lead_id: string;
  subject: string;
  body: string;
  status: 'pending' | 'sent' | 'failed';
  sent_at?: string;
  error?: string;
}

export interface Lead {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  position?: string;
  linkedin_url?: string;
  status: 'new' | 'contacted' | 'responded' | 'converted' | 'lost';
  created_at: string;
  updated_at: string;
}

export interface ClientProfile {
  client_id: string;
  company_name: string;
  industry: string;
  icp_title?: string;
  calendly_url?: string;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface GmailToken {
  client_id: string;
  access_token: string;
  refresh_token: string;
  created_at: string;
  updated_at: string;
}

export interface SearchRequest {
  keyword: string;
  filters?: {
    location?: string;
    industry?: string;
    company_size?: string;
    seniority?: string;
  };
}

export interface SearchResponse {
  leads_count: number;
  keyword: string;
  location?: string;
  leads: Lead[];
}

export interface FollowupRequest {
  user_id: string;
  lead_id: string;
  subject?: string;
  body?: string;
}

export interface FollowupResponse {
  success: boolean;
  message_id?: string;
  error?: ApiError;
}

export interface EmailRequest {
  user_id: string;
  lead_id: string;
  subject: string;
  body: string;
}

export interface EmailResponse {
  success: boolean;
  message_id?: string;
  error?: ApiError;
}

export interface GmailConnectionRequest {
  action: 'connect' | 'exchange_code' | 'check_connection';
  client_id: string;
  code?: string;
  redirect_url?: string;
}

export interface GmailConnectionResponse {
  connected?: boolean;
  auth_url?: string;
  error?: ApiError;
}

// Helper type for Supabase function responses
export type EdgeFunctionResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: ApiError;
}; 