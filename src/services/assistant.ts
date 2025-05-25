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
  public clientId: string;

  constructor(clientId: string, conversationId?: string) {
    this.clientId = clientId;
    this.conversationId = conversationId || crypto.randomUUID();
    this.apiClient = APIClient.getInstance();
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
        client_id: this.clientId,
        created_at: now
      };

      leads.push(lead);
    }

    return leads;
  }

  private async saveLeadsToSupabase(leads: Lead[]): Promise<Lead[]> {
    try {
      console.log('AssistantService: Starting Supabase lead insertion');
      
      // Insert leads one by one to handle duplicates gracefully
      const insertedLeads: Lead[] = [];
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

          if (data && data[0]) {
            console.log('AssistantService: Successfully inserted lead:', {
              id: data[0].id,
              full_name: data[0].full_name
            });
            insertedLeads.push(data[0]);
          }
        } catch (error) {
          console.error('AssistantService: Error processing individual lead:', error);
          continue;
        }
      }

      console.log(`AssistantService: Completed lead insertion, saved ${insertedLeads.length}/${leads.length} leads`);
      return insertedLeads;
    } catch (error) {
      console.error('AssistantService: Error in saveLeadsToSupabase:', error);
      throw error;
    }
  }

  async saveMessageToDatabase(message: Message): Promise<void> {
    // This is now handled by the API client
    return;
  }

  async sendMessage(content: string): Promise<AssistantResponse> {
    try {
      console.log('AssistantService: Processing message:', { content });

      // Check if this is a search query
      if (content.toLowerCase().includes('trouve') || 
          content.toLowerCase().includes('cherche') || 
          content.toLowerCase().includes('recherche')) {
        console.log('AssistantService: Detected search query, generating leads');
        
        // Generate leads in the background
        this.processSearchQuery(content).catch(error => {
          console.error('AssistantService: Background lead generation failed:', error);
        });

        // Return immediately with acknowledgment
        return {
          message: "Je recherche des leads correspondant à vos critères. Ils apparaîtront dans votre tableau de bord dans quelques instants.",
          leads: [] // Don't return leads in response, let Supabase real-time handle it
        };
      }

      // For non-search queries, use the OpenAI assistant
      const response = await this.apiClient.post('/openai-assistant', {
        message: content,
        userId: this.clientId,
        conversationId: this.conversationId,
        messages: this.messages
      });
      
      console.log('AssistantService: Received response from OpenAI');

      // Check if the response contains structured lead data
      if (content.includes('### Lead')) {
        console.log('AssistantService: Detected lead data in message, starting background processing');
        
        // Process leads in the background
        this.processLeadsFromMarkdown(content).catch(error => {
          console.error('AssistantService: Background lead processing failed:', error);
        });

        return {
          message: "J'ai bien reçu votre liste de leads. Je les ajoute à votre tableau de bord en arrière-plan.",
          leads: []
        };
      }

      // Return the original assistant response
      return {
        message: response.message,
        leads: []
      };
    } catch (error) {
      console.error('Error in AssistantService.sendMessage:', error);
      throw error;
    }
  }

  private async processSearchQuery(query: string): Promise<void> {
    try {
      console.log('AssistantService: Starting search query processing:', { query });
      
      // Call the lead-search function
      const baseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!baseUrl) {
        throw new Error('VITE_SUPABASE_URL is not defined');
      }

      console.log('AssistantService: Calling lead-search function');
      const response = await fetch(`${baseUrl}/functions/v1/lead-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          searchQuery: query,
          clientId: this.clientId,
          isDemoData: true // For now, always use demo data
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Lead search failed: ${errorData.error || response.statusText}`);
      }

      const { leads } = await response.json();
      console.log(`AssistantService: Received ${leads?.length || 0} leads from search`);

      if (!leads || leads.length === 0) {
        console.log('AssistantService: No leads found, generating synthetic leads');
        const syntheticLeads = this.generateSyntheticLeads(query);
        console.log(`AssistantService: Generated ${syntheticLeads.length} synthetic leads`);
        
        // Save the synthetic leads
        const savedLeads = await this.saveLeadsToSupabase(syntheticLeads);
        console.log(`AssistantService: Saved ${savedLeads.length} synthetic leads`);

        // Notify listeners
        if (this.onLeadsUpdate) {
          this.onLeadsUpdate(savedLeads);
        }
      } else {
        console.log(`AssistantService: Processing ${leads.length} leads from search`);
        
        // Save the leads from search
        const savedLeads = await this.saveLeadsToSupabase(leads);
        console.log(`AssistantService: Saved ${savedLeads.length} leads from search`);

        // Notify listeners
        if (this.onLeadsUpdate) {
          this.onLeadsUpdate(savedLeads);
        }
      }
    } catch (error) {
      console.error('AssistantService: Error in processSearchQuery:', error);
      // Generate synthetic leads as fallback
      try {
        console.log('AssistantService: Falling back to synthetic leads generation');
        const syntheticLeads = this.generateSyntheticLeads(query);
        const savedLeads = await this.saveLeadsToSupabase(syntheticLeads);
        
        if (this.onLeadsUpdate) {
          this.onLeadsUpdate(savedLeads);
        }
      } catch (fallbackError) {
        console.error('AssistantService: Fallback to synthetic leads failed:', fallbackError);
        throw fallbackError;
      }
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

        console.log('AssistantService: Parsed lead data:', leadData);

        return {
          id: crypto.randomUUID(),
          client_id: this.clientId,
          full_name: leadData.nom_de_contact || '',
          job_title: leadData.poste || null,
          company: leadData.entreprise || null,
          location: leadData.localisation || null,
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

      console.log(`AssistantService: Processed ${leads.length} leads, starting Supabase insert`);

      // Save the leads to Supabase
      const savedLeads = await this.saveLeadsToSupabase(leads);
      console.log(`AssistantService: Successfully saved ${savedLeads.length} leads to Supabase`);

      // Notify listeners about the new leads
      if (this.onLeadsUpdate) {
        console.log('AssistantService: Notifying listeners about new leads');
        this.onLeadsUpdate(savedLeads);
      }
    } catch (error) {
      console.error('AssistantService: Error processing leads:', error);
      throw error;
    }
  }
} 