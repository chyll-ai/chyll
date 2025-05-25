import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { APIClient } from '@/lib/api-client';
import { Lead } from '@/types/assistant';

// Message interface definition
interface Message {
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  name?: string;
  toolCalls?: any[];
}

export class AssistantService {
  private messages: Message[] = [];
  private userId: string;
  private apiClient: APIClient;
  private onLeadsUpdate?: (leads: Lead[]) => void;

  constructor(userId: string) {
    this.userId = userId;
    this.messages = [];
    this.apiClient = APIClient.getInstance();
    console.log('AssistantService: Initialized');
  }

  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  setLeadsUpdateCallback(callback: (leads: Lead[]) => void) {
    this.onLeadsUpdate = callback;
  }

  async sendMessage(content: string): Promise<{ message: string }> {
    try {
      console.log('AssistantService: Sending message:', { content });

      // Check if this is a search query
      if (content.toLowerCase().includes('trouve') || 
          content.toLowerCase().includes('cherche') || 
          content.toLowerCase().includes('recherche')) {
        console.log('AssistantService: Detected search query');
        
        // Process leads in the background
        this.processSearchQuery(content).catch(error => {
          console.error('AssistantService: Background lead processing failed:', error);
        });

        // Return immediately with acknowledgment
        return {
          message: "Je recherche des leads correspondant à vos critères. Ils apparaîtront dans votre tableau de bord dans quelques instants."
        };
      }

      // Send message to Edge Function
      const response = await this.apiClient.sendMessage({
        message: content,
        userId: this.userId
      });
      
      // Add user message to conversation
      const userMessage: Message = {
        role: 'user',
        content
      };
      
      // Save message to database
      await this.saveMessageToDatabase(userMessage);
      this.messages.push(userMessage);

      // Add assistant's response
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message
      };

      // Check if the response contains lead data
      if (response.message.includes('### Lead')) {
        console.log('AssistantService: Detected lead data in response');
        this.processLeadsFromMarkdown(response.message).catch(error => {
          console.error('AssistantService: Lead processing failed:', error);
        });
      }

      // Save message to database
      await this.saveMessageToDatabase(assistantMessage);
      this.messages.push(assistantMessage);

      return {
        message: response.message
      };
    } catch (error) {
      console.error('Error in sendMessage:', error);
      toast.error('Failed to send message. Please try again.');
      throw error;
    }
  }

  private async processSearchQuery(query: string): Promise<void> {
    try {
      console.log('AssistantService: Processing search query:', { query });
      
      // Call the lead-search function
      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!baseUrl) {
        throw new Error('VITE_SUPABASE_URL is not defined');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }

      console.log('AssistantService: Calling lead-search function');
      const response = await fetch(`${baseUrl}/functions/v1/lead-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          searchQuery: query,
          clientId: this.userId,
          isDemoData: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Lead search failed: ${errorData.error || response.statusText}`);
      }

      const { leads } = await response.json();
      console.log(`AssistantService: Received ${leads?.length || 0} leads from search`);

      if (leads?.length > 0) {
        await this.saveLeadsToSupabase(leads);
      }
    } catch (error) {
      console.error('AssistantService: Error in processSearchQuery:', error);
      throw error;
    }
  }

  private async processLeadsFromMarkdown(content: string): Promise<void> {
    try {
      console.log('AssistantService: Starting lead extraction from markdown');
      
      // Parse leads from the markdown format
      const leadSections = content.split('### Lead').slice(1);
      console.log(`AssistantService: Found ${leadSections.length} lead sections`);

      const leads = leadSections.map(section => {
        const lines = section.split('\n').filter(line => line.trim());
        const leadData: any = {};
        
        lines.forEach(line => {
          if (line.includes('**')) {
            const [key, value] = line.split(':**').map(s => s.trim());
            const cleanKey = key.replace('**', '').toLowerCase().replace(/ /g, '_');
            const cleanValue = value.replace(/\[|\]|\(|\)|#/g, '').trim();
            leadData[cleanKey] = cleanValue;
          }
        });

        return {
          id: crypto.randomUUID(),
          client_id: this.userId,
          full_name: leadData.nom || '',
          job_title: leadData.poste || null,
          company: leadData.entreprise || null,
          location: leadData.localisation || leadData.adresse || null,
          email: leadData.email?.toLowerCase() || null,
          phone_number: leadData.telephone || null,
          linkedin_url: leadData.linkedin || null,
          status: 'à contacter',
          enriched_from: { 
            source: 'assistant', 
            timestamp: new Date().toISOString(),
            notes: leadData.notes || null
          },
          created_at: new Date().toISOString()
        };
      });

      await this.saveLeadsToSupabase(leads);
    } catch (error) {
      console.error('AssistantService: Error processing leads:', error);
      throw error;
    }
  }

  private async saveLeadsToSupabase(leads: Lead[]): Promise<void> {
    try {
      console.log('AssistantService: Starting Supabase lead insertion');
      
      // Insert leads one by one to handle duplicates gracefully
      for (const lead of leads) {
        try {
          console.log('AssistantService: Inserting lead:', { 
            full_name: lead.full_name,
            email: lead.email,
            company: lead.company 
          });

          const { data, error } = await supabase
            .from('leads')
            .upsert([lead], {
              onConflict: 'client_id,email',
              ignoreDuplicates: true
            })
            .select();

          if (error) {
            console.error('AssistantService: Error inserting lead:', error);
            continue;
          }

          if (data && data[0] && this.onLeadsUpdate) {
            console.log('AssistantService: Successfully inserted lead:', {
              id: data[0].id,
              full_name: data[0].full_name
            });
            this.onLeadsUpdate([data[0]]);
          }
        } catch (error) {
          console.error('AssistantService: Error processing individual lead:', error);
          continue;
        }
      }

      console.log(`AssistantService: Completed lead insertion`);
    } catch (error) {
      console.error('AssistantService: Error in saveLeadsToSupabase:', error);
      throw error;
    }
  }

  private async saveMessageToDatabase(message: Message) {
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          client_id: this.userId,
          role: message.role,
          content: message.content
        });

      if (error) {
        console.error('Error saving message:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in saveMessageToDatabase:', error);
      throw error;
    }
  }
}
