export interface Message {
  id?: string;
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  toolCalls?: any[];
  client_id?: string;
  conversation_id?: string;
  chat_session_id?: string;
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