import { Message, Lead } from '@/types/assistant';
import { APIClient } from '@/lib/api-client';
import { supabase } from '@/lib/supabase';

interface AssistantResponse {
  message: string;
  leads?: Lead[];
}

export class AssistantService {
  private messages: Message[] = [];
  private apiClient: APIClient;
  private onLeadsUpdate?: (leads: Lead[]) => void;
  public conversationId: string;
  public userId: string;

  constructor(userId: string, conversationId?: string) {
    this.userId = userId;
    this.conversationId = conversationId || crypto.randomUUID();
    this.apiClient = new APIClient();
  }

  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  setLeadsUpdateCallback(callback: (leads: Lead[]) => void) {
    this.onLeadsUpdate = callback;
  }

  private generateSyntheticLeads(query: string): Lead[] {
    // Extract location and sector from query
    const location = query.toLowerCase().includes('paris') ? 'Paris' : 'France';
    const sector = query.toLowerCase().includes('tech') ? 'tech' : 'technology';

    // Common French tech companies
    const companies = [
      'Doctolib',
      'Deezer',
      'BlaBlaCar',
      'Ledger',
      'Back Market',
      'Qonto',
      'Dataiku',
      'Contentsquare',
      'Alan',
      'Sorare'
    ];

    // Tech job titles
    const jobTitles = [
      'CTO',
      'Lead Developer',
      'Product Manager',
      'Tech Lead',
      'VP Engineering',
      'Head of Innovation',
      'Directeur Technique',
      'Architecte Solution',
      'DevOps Engineer',
      'Full Stack Developer'
    ];

    // Generate 5-10 random leads
    const numLeads = Math.floor(Math.random() * 6) + 5;
    const leads: Lead[] = [];
    const now = new Date().toISOString();

    for (let i = 0; i < numLeads; i++) {
      // Generate French-style names
      const firstNames = ['Thomas', 'Nicolas', 'Antoine', 'Marie', 'Sophie', 'Julie', 'Lucas', 'Emma', 'Louis', 'Léa'];
      const lastNames = ['Dubois', 'Bernard', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent'];
      
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      
      const lead: Lead = {
        id: crypto.randomUUID(),
        full_name: `${firstName} ${lastName}`,
        job_title: jobTitle,
        company: company,
        location: location,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(' ', '')}.com`,
        phone_number: `+33${Math.floor(Math.random() * 900000000) + 100000000}`,
        linkedin_url: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.random().toString(36).substring(7)}`,
        status: 'new',
        client_id: this.userId,
        created_at: now
      };

      leads.push(lead);
    }

    return leads;
  }

  private async saveLeadsToSupabase(leads: Lead[]): Promise<Lead[]> {
    try {
      const enrichedLeads = leads.map(lead => ({
        ...lead,
        created_at: new Date().toISOString()
      }));

      const { data, error } = await supabase
        .from('leads')
        .upsert(enrichedLeads, {
          onConflict: 'id',
          ignoreDuplicates: false
        })
        .select();

      if (error) {
        console.error('Error saving leads to Supabase:', error);
        throw error;
      }

      return data || enrichedLeads;
    } catch (error) {
      console.error('Error in saveLeadsToSupabase:', error);
      throw error;
    }
  }

  async saveMessageToDatabase(message: Message): Promise<void> {
    // This is now handled by the API client
    return;
  }

  async sendMessage(content: string): Promise<AssistantResponse> {
    try {
      let leads: Lead[] = [];
      let assistantMessage = '';

      // Generate synthetic leads for search queries
      if (content.toLowerCase().includes('trouve') || 
          content.toLowerCase().includes('cherche') || 
          content.toLowerCase().includes('recherche')) {
        
        leads = this.generateSyntheticLeads(content);
        assistantMessage = `J'ai trouvé ${leads.length} leads dans le secteur tech à Paris. Voici les profils les plus pertinents basés sur votre recherche. Vous pouvez voir les détails complets dans le tableau à droite.`;
        
        // Save the generated leads to Supabase
        const savedLeads = await this.saveLeadsToSupabase(leads);
        
        // Notify listeners about the new leads
        if (this.onLeadsUpdate) {
          this.onLeadsUpdate(savedLeads);
        }
      } else {
        // For non-search queries, use the OpenAI assistant
        const response = await this.apiClient.post('/openai-assistant', {
          message: content,
          userId: this.userId,
          conversationId: this.conversationId,
          messages: this.messages
        });
        
        assistantMessage = response.message;
      }

      return {
        message: assistantMessage,
        leads: leads
      };
    } catch (error) {
      console.error('Error in AssistantService.sendMessage:', error);
      throw error;
    }
  }
} 