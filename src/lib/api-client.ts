import { supabase } from '@/lib/supabase';

interface OpenAIRequest {
  message: string;
  userId: string;
}

interface OpenAIResponse {
  message: string;
}

export class APIClient {
  private baseUrl: string;
  private anonKey: string;
  private static instance: APIClient;

  private constructor() {
    // Use the correct base URL for production
    this.baseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co';
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

  async post(endpoint: string, data: any) {
    try {
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
        // Try to parse error response
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || 'Unknown error';
        } catch {
          // If we can't parse JSON, use the status text
          errorMessage = response.statusText;
        }
        throw new Error(`API error: ${errorMessage} (${response.status})`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async sendMessage(data: OpenAIRequest): Promise<OpenAIResponse> {
    return this.post('/openai-assistant', data);
  }
}