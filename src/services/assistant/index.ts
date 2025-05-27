
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
          content.toLowerCase().includes('recherche') ||
          content.toLowerCase().includes('leads') ||
          content.toLowerCase().includes('prospects')) {
        console.log('AssistantService: Detected search query');
        
        // Generate dummy leads for demo
        const dummyLeads = this.generateDummyLeads(content);
        
        // Save leads to database
        await this.saveDummyLeads(dummyLeads);
        
        // Update UI through callback
        if (this.onLeadsUpdate) {
          this.onLeadsUpdate(dummyLeads);
        }
        
        toast.success(`${dummyLeads.length} nouveaux leads ajoutés au tableau de bord`);

        // Return success message
        return {
          message: `Parfait ! J'ai trouvé ${dummyLeads.length} leads correspondant à votre recherche "${content}". Ils ont été ajoutés à votre tableau de bord. Vous pouvez les voir dans la section "Recent Leads" à droite.`
        };
      }

      // For non-search messages, proceed with normal message handling
      const response = await this.apiClient.sendMessage({
        message: content,
        userId: this.userId
      });
      
      // Add user message to conversation
      const userMessage: Message = {
        role: 'user',
        content
      };
      
      await this.saveMessageToDatabase(userMessage);
      this.messages.push(userMessage);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message
      };

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

  private generateDummyLeads(searchQuery: string): Lead[] {
    const companies = [
      'DataTech Solutions', 'InnovateLab', 'TechForward SAS', 'DigitalFlow', 'CloudWorks',
      'CodeCraft', 'ByteForge', 'NextGen Tech', 'SmartSolutions', 'DevStream'
    ];
    
    const firstNames = ['Sophie', 'Pierre', 'Marie', 'Thomas', 'Claire', 'Lucas', 'Emma', 'Nicolas', 'Camille', 'Antoine'];
    const lastNames = ['Martin', 'Bernard', 'Dubois', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia'];
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'];
    
    const jobTitles = [
      'CTO', 'Directeur Technique', 'Head of Engineering', 'VP Technology', 'Chief Innovation Officer',
      'Lead Developer', 'Senior Software Engineer', 'Tech Lead', 'Solutions Architect', 'Product Manager'
    ];

    const leads: Lead[] = [];
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 leads

    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      
      const lead: Lead = {
        id: crypto.randomUUID(),
        client_id: this.userId,
        full_name: `${firstName} ${lastName}`,
        job_title: jobTitle,
        company: company,
        location: city,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.fr`,
        phone_number: `+33 6${Math.floor(Math.random() * 90000000) + 10000000}`,
        linkedin_url: `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
        status: 'new',
        created_at: new Date().toISOString(),
        enriched_from: {
          source: 'assistant',
          timestamp: new Date().toISOString(),
          notes: `Generated from search: "${searchQuery}"`
        }
      };
      
      leads.push(lead);
    }

    return leads;
  }

  private async saveDummyLeads(leads: Lead[]): Promise<void> {
    try {
      console.log('AssistantService: Saving dummy leads to database');
      
      const { data: savedLeads, error } = await supabase
        .from('leads')
        .upsert(leads, {
          onConflict: 'client_id,email',
          ignoreDuplicates: true
        })
        .select('*');

      if (error) {
        console.error('AssistantService: Error saving dummy leads:', error);
        throw error;
      }

      console.log('AssistantService: Successfully saved leads:', savedLeads?.length || 0);
    } catch (error) {
      console.error('AssistantService: Error in saveDummyLeads:', error);
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
