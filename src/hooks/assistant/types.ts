export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  toolCalls?: any[];
}

export interface DatabaseMessage {
  id: string;
  role: string;
  content: string;
  client_id: string;
  conversation_id: string;
  chat_session_id?: string;
  toolCalls?: Json | null;
}

export interface ClientProfile {
  id: string;
  client_id: string;
  company_name: string | null;
  industry: string | null;
}

export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface UpdateMessageToolcallsParams {
  message_id: string;
  tool_calls: string | any;
}

// Add Json type if not already defined
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
