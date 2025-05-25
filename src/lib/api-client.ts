import { supabase } from './supabase';

interface OpenAIRequest {
  message: string;
  userId: string;
}

interface OpenAIResponse {
  message: string;
}

export class APIClient {
  private static instance: APIClient;
  private baseUrl: string;
  private anonKey: string;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL;
    this.anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!this.baseUrl || !this.anonKey) {
      throw new Error('Missing required environment variables');
    }
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.anonKey}`,
    };
  }

  public async sendMessage(request: OpenAIRequest): Promise<OpenAIResponse> {
    const response = await fetch(`${this.baseUrl}/functions/v1/openai-assistant`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Edge Function error:', errorData);
      throw new Error(errorData.error || 'Failed to send message');
    }

    return response.json();
  }
} 