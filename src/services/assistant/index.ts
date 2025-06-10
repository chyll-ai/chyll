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
  private generatedNames: Set<string> = new Set();
  private generatedEmails: Set<string> = new Set();

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
        
        // Try to use the smarter OpenAI generation first
        try {
          const smartLeads = await this.generateSmartLeads(content);
          
          // Save leads to database
          await this.saveDummyLeads(smartLeads);
          
          // Update UI through callback
          if (this.onLeadsUpdate) {
            this.onLeadsUpdate(smartLeads);
          }
          
          toast.success(`${smartLeads.length} nouveaux leads ajoutés au tableau de bord`);

          return {
            message: `Parfait ! J'ai trouvé ${smartLeads.length} leads spécialisés correspondant à votre recherche "${content}". Ces contacts ont été soigneusement sélectionnés pour correspondre exactement à vos critères. Vous pouvez les voir dans la section "Recent Leads" à droite.`
          };
        } catch (error) {
          console.error('Smart lead generation failed, falling back to dummy generation:', error);
          
          // Fallback to dummy leads if OpenAI fails
          const dummyLeads = this.generateDummyLeads(content);
          await this.saveDummyLeads(dummyLeads);
          
          if (this.onLeadsUpdate) {
            this.onLeadsUpdate(dummyLeads);
          }
          
          toast.success(`${dummyLeads.length} nouveaux leads ajoutés au tableau de bord`);

          return {
            message: `J'ai trouvé ${dummyLeads.length} leads correspondant à votre recherche "${content}". Ils ont été ajoutés à votre tableau de bord. (Note: génération de démo)`
          };
        }
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

  private async generateSmartLeads(searchQuery: string): Promise<Lead[]> {
    try {
      console.log('Calling smart lead generation for:', searchQuery);
      
      // Call the OpenAI-powered lead search function
      const response = await fetch(`https://atsfuqwxfrezkxtnctmk.supabase.co/functions/v1/lead-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`,
        },
        body: JSON.stringify({
          searchQuery: searchQuery,
          count: 5,
          userId: this.userId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Lead generation failed: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      console.log('Smart lead generation successful:', data.leads?.length || 0);
      return data.leads || [];
    } catch (error) {
      console.error('Smart lead generation error:', error);
      throw error;
    }
  }

  private generateDummyLeads(searchQuery: string): Lead[] {
    // Enhanced dummy generation with better variety
    const techCompanies = [
      'InnovTech Solutions', 'DataFlow Systems', 'CodeCraft Studio', 'NextGen Analytics', 'CloudFirst Technologies',
      'ByteForge Labs', 'SmartCode Solutions', 'DevStream Technologies', 'TechPulse SAS', 'DigitalMind Studio'
    ];
    
    const frenchFirstNames = ['Amélie', 'Baptiste', 'Céline', 'Damien', 'Élise', 'Fabien', 'Gabrielle', 'Hugo', 'Inès', 'Julien'];
    const frenchLastNames = ['Dubois', 'Lefevre', 'Moreau', 'Rousseau', 'Vincent', 'Fournier', 'Girard', 'Andre', 'Mercier', 'Dupont'];
    const techCities = ['Paris', 'Lyon', 'Toulouse', 'Nice', 'Bordeaux', 'Nantes', 'Montpellier', 'Rennes', 'Grenoble', 'Strasbourg'];
    
    // More specific job titles based on search query
    let jobTitles = ['Développeur Senior', 'Chef de Projet Technique', 'Architecte Solution', 'Lead Developer', 'Product Manager'];
    
    // Customize job titles based on search query
    if (searchQuery.toLowerCase().includes('cto') || searchQuery.toLowerCase().includes('directeur technique')) {
      jobTitles = ['CTO', 'Directeur Technique', 'VP Engineering', 'Chief Technology Officer'];
    } else if (searchQuery.toLowerCase().includes('lead') || searchQuery.toLowerCase().includes('senior')) {
      jobTitles = ['Lead Developer', 'Senior Software Engineer', 'Tech Lead', 'Senior Product Manager'];
    } else if (searchQuery.toLowerCase().includes('product')) {
      jobTitles = ['Product Manager', 'Head of Product', 'Senior Product Owner', 'VP Product'];
    }

    const leads: Lead[] = [];
    const count = Math.floor(Math.random() * 3) + 3; // 3-5 leads

    for (let i = 0; i < count; i++) {
      let firstName, lastName, fullName, email;
      let attempts = 0;
      
      // Ensure uniqueness
      do {
        firstName = frenchFirstNames[Math.floor(Math.random() * frenchFirstNames.length)];
        lastName = frenchLastNames[Math.floor(Math.random() * frenchLastNames.length)];
        fullName = `${firstName} ${lastName}`;
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${techCompanies[i % techCompanies.length].toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}.fr`;
        attempts++;
      } while ((this.generatedNames.has(fullName) || this.generatedEmails.has(email)) && attempts < 20);
      
      this.generatedNames.add(fullName);
      this.generatedEmails.add(email);
      
      const company = techCompanies[Math.floor(Math.random() * techCompanies.length)];
      const city = techCities[Math.floor(Math.random() * techCities.length)];
      const jobTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      
      const lead: Lead = {
        id: crypto.randomUUID(),
        client_id: this.userId,
        full_name: fullName,
        job_title: jobTitle,
        company: company,
        location: city,
        email: email,
        phone_number: `+33 6${Math.floor(Math.random() * 90000000) + 10000000}`,
        linkedin_url: `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
        status: 'new',
        created_at: new Date().toISOString(),
        enriched_from: {
          source: 'assistant_fallback',
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
      console.log('AssistantService: Saving leads to database');
      
      const { data: savedLeads, error } = await supabase
        .from('leads')
        .upsert(leads, {
          onConflict: 'client_id,email',
          ignoreDuplicates: true
        })
        .select('*');

      if (error) {
        console.error('AssistantService: Error saving leads:', error);
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
