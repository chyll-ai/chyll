export interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  toolCalls?: any[];  // Note: matches the database column name
  created_at?: string;  // Changed from createdAt to match DB
  updated_at?: string;  // Added to match DB
  client_id?: string;   // Added to match DB
  conversation_id?: string;
  chat_session_id?: string;  // Added to match DB
  name?: string;  // For function messages
}

export interface Lead {
  id: string;
  full_name: string;
  job_title: string;
  company: string;
  location: string;
  email: string;
  linkedin_url: string;
  status: string;
  created_at: string;
}

export interface AssistantState {
  loading: boolean;
  sending: boolean;
  isGenerating: boolean;
  messages: Message[];
  leads: Lead[];
  sendMessage: (content: string) => Promise<void>;
  userId: string;
  hasProfile: boolean;
  conversationId: string;
} 