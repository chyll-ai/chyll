export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  client_id: string;
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
  sendMessage: (content: string) => Promise<void>;
  userId: string;
} 