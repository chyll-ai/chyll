export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: any[];
  createdAt?: string;
}

export interface AssistantState {
  loading: boolean;
  sending: boolean;
  isGenerating: boolean;
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  userId: string;
  hasProfile: boolean;
  threadId: string;
  currentRunId: string;
  conversationId: string;
} 