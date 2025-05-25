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
        
        // Send the search request to the API
        const response = await this.apiClient.sendMessage({
          message: `Je vais générer des leads B2B pour votre recherche: "${content}"

Instructions pour la génération des leads:
1. Générer 5 leads détaillés
2. Pour chaque lead, fournir:
   - Nom complet (format français)
   - Poste (pertinent pour la recherche)
   - Entreprise (entreprise tech française réelle)
   - Localisation (ville française)
   - Email (format: prenom.nom@entreprise.fr)
   - Téléphone (format: +33 6XX XX XX XX)
   - LinkedIn (format: linkedin.com/in/prenom-nom-xxxx)

Répondre au format suivant:

### Lead 1
**Nom:** [nom complet]
**Poste:** [poste]
**Entreprise:** [entreprise]
**Localisation:** [ville]
**Email:** [email]
**Téléphone:** [téléphone]
**LinkedIn:** [url]

[Répéter pour chaque lead]`,
          userId: this.userId
        });

        // Process the response to extract leads
        await this.processLeadsFromMarkdown(response.message);

        // Return success message
        return {
          message: "Je recherche des leads correspondant à vos critères. Ils apparaîtront dans votre tableau de bord dans quelques instants."
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

  private async processLeadsFromMarkdown(content: string): Promise<void> {
    try {
      console.log('AssistantService: Starting lead extraction from markdown');
      
      // Parse leads from the markdown format
      const leadSections = content.split('### Lead').slice(1);
      console.log(`AssistantService: Found ${leadSections.length} lead sections`);

      if (leadSections.length === 0) {
        throw new Error('No leads found in response');
      }

      const leads = leadSections.map((section, index) => {
        const lines = section.split('\n').filter(line => line.trim());
        const leadData: any = {};
        
        lines.forEach(line => {
          if (line.includes('**')) {
            const [key, value] = line.split(':**').map(s => s.trim());
            const cleanKey = key.replace('**', '').toLowerCase();
            const cleanValue = value.replace(/\[|\]|\(|\)|#/g, '').trim();
            
            // Map markdown keys to database fields
            const fieldMap: { [key: string]: string } = {
              'nom': 'full_name',
              'poste': 'job_title',
              'entreprise': 'company',
              'localisation': 'location',
              'email': 'email',
              'téléphone': 'phone_number',
              'linkedin': 'linkedin_url'
            };

            const dbField = fieldMap[cleanKey];
            if (dbField) {
              leadData[dbField] = cleanValue;
            }
          }
        });

        // Validate required fields
        const requiredFields = ['full_name', 'job_title', 'company', 'location', 'email', 'phone_number', 'linkedin_url'];
        const missingFields = requiredFields.filter(field => !leadData[field]);
        
        if (missingFields.length > 0) {
          console.error(`Lead ${index + 1} missing fields:`, missingFields);
          throw new Error(`Lead ${index + 1} is missing required fields: ${missingFields.join(', ')}`);
        }

        return {
          ...leadData,
          client_id: this.userId,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          status: 'new',
          enriched_from: {
            source: 'assistant',
            timestamp: new Date().toISOString()
          }
        };
      });

      console.log('AssistantService: Extracted leads:', JSON.stringify(leads, null, 2));

      // Save leads to database
      try {
        console.log('AssistantService: Starting batch save of leads');
        const { data: savedLeads, error } = await supabase
          .from('leads')
          .upsert(leads, {
            onConflict: 'client_id,email',
            ignoreDuplicates: true
          })
          .select('*, email_jobs(*)');  // Include email_jobs in the response

        if (error) {
          console.error('AssistantService: Error batch saving leads:', error);
          toast.error('Erreur lors de la sauvegarde des leads');
          return;
        }

        // Update UI if we have saved leads
        if (savedLeads && savedLeads.length > 0) {
          console.log('AssistantService: Successfully saved leads:', savedLeads.length);
          
          // Emit realtime event for each saved lead
          for (const lead of savedLeads) {
            await supabase
              .from('leads')
              .update({ updated_at: new Date().toISOString() })
              .eq('id', lead.id);
          }
          
          // Update UI through callback
          if (this.onLeadsUpdate) {
            this.onLeadsUpdate(savedLeads);
          }
          
          toast.success(`${savedLeads.length} nouveaux leads ajoutés au tableau de bord`);
        } else if (!savedLeads || savedLeads.length === 0) {
          toast.error('Aucun nouveau lead n\'a été ajouté');
        }
      } catch (error) {
        console.error('AssistantService: Error in batch save operation:', error);
        toast.error('Erreur lors de la sauvegarde des leads');
      }
    } catch (error) {
      console.error('AssistantService: Error processing leads:', error);
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
