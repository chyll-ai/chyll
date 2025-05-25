import { supabase } from './supabase';

interface OpenAIRequest {
  message: string;
  userId: string;
}

export interface OpenAIResponse {
  message: string;
  toolCalls?: any[];
}

export class APIClient {
  private baseUrl: string;
  private anonKey: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }

  async post(endpoint: string, data: any) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('No session found');

    const response = await fetch(`${this.baseUrl}/functions/v1${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        'apikey': this.anonKey
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || 'Unknown error'}`);
    }

    return response.json();
  }

  async sendMessage(data: OpenAIRequest): Promise<OpenAIResponse> {
    return this.post('/assistant/chat', data);
  }
} 