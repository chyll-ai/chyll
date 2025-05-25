import { Message } from '@/types/assistant';
import { APIClient } from '@/lib/api-client';

export class AssistantService {
  private messages: Message[] = [];
  private clientId: string;
  private apiClient: APIClient;

  constructor(clientId: string) {
    this.clientId = clientId;
    this.apiClient = new APIClient();
    console.log('AssistantService: Initialized');
  }

  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  async sendMessage(content: string): Promise<{ message: string }> {
    try {
      const response = await this.apiClient.post('/openai-assistant', {
        message: content,
        userId: this.clientId
      });

      return response;
    } catch (error) {
      console.error('Error in AssistantService.sendMessage:', error);
      throw error;
    }
  }
} 