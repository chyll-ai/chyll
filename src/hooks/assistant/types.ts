
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  toolCalls?: any[];
}

export interface DatabaseMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
  client_id: string;
  chat_session_id?: string;
  toolCalls?: any;
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
