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
    console.log('AssistantService: Initialized for user:', userId);
  }

  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  setLeadsUpdateCallback(callback: (leads: Lead[]) => void) {
    this.onLeadsUpdate = callback;
  }

  async sendMessage(content: string): Promise<{ message: string }> {
    try {
      console.log('AssistantService: Sending message:', { content, userId: this.userId });

      // Check if this is a search query
      if (content.toLowerCase().includes('trouve') || 
          content.toLowerCase().includes('cherche') || 
          content.toLowerCase().includes('recherche') ||
          content.toLowerCase().includes('leads') ||
          content.toLowerCase().includes('prospects') ||
          content.toLowerCase().includes('freelances')) {
        console.log('AssistantService: Detected search query, using PDL search');
        
        // Extract number from query (default to 5 if not specified, max 10)
        const numberMatch = content.match(/(\d+)/);
        const requestedCount = Math.min(numberMatch ? parseInt(numberMatch[1]) : 5, 10);
        
        console.log(`AssistantService: Searching with PDL for ${requestedCount} leads`);
        
        try {
          // Call PDL search function
          const { data: searchResult, error: searchError } = await supabase.functions
            .invoke('pdl-search', {
              body: {
                searchQuery: content,
                userId: this.userId,
                count: requestedCount
              }
            });

          if (searchError) {
            console.error('PDL search error:', searchError);
            throw searchError;
          }

          if (!searchResult.success) {
            throw new Error(searchResult.error || 'Search failed');
          }

          const leads = searchResult.leads || [];
          console.log('PDL search found:', leads.length, 'leads');

          if (leads.length > 0) {
            // Save leads to database
            const savedLeads = await this.savePDLLeads(leads);
            
            if (this.onLeadsUpdate) {
              this.onLeadsUpdate(savedLeads);
            }
            
            toast.success(`${savedLeads.length} nouveaux leads trouvés via People Data Labs`);

            return {
              message: `Excellent ! J'ai trouvé ${savedLeads.length} leads professionnels correspondant à votre recherche "${content}" via People Data Labs. Ces contacts ont été enrichis avec des données réelles et ajoutés à votre tableau de bord. Vous pouvez les voir dans la section des leads.`
            };
          } else {
            return {
              message: `Je n'ai pas trouvé de leads correspondant exactement à votre recherche "${content}". Essayez d'utiliser des termes plus généraux comme "Commercial Paris" ou "CTO France".`
            };
          }
        } catch (error) {
          console.error('PDL search failed, falling back to demo data:', error);
          
          // Fallback to demo leads if PDL fails
          const demoLeads = this.generateDemoLeads(content, requestedCount);
          const savedLeads = await this.saveDemoLeads(demoLeads);
          
          if (this.onLeadsUpdate) {
            this.onLeadsUpdate(savedLeads);
          }
          
          toast.warning('Données de démonstration utilisées (erreur PDL)');

          return {
            message: `J'ai rencontré une difficulté avec l'API People Data Labs, mais j'ai généré ${savedLeads.length} leads de démonstration pour "${content}". Pour utiliser de vraies données, vérifiez votre configuration PDL.`
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
      console.error('AssistantService: Error in sendMessage:', error);
      toast.error('Échec de l\'envoi du message. Veuillez réessayer.');
      throw error;
    }
  }

  private async savePDLLeads(leads: Lead[]): Promise<Lead[]> {
    try {
      console.log('AssistantService: Saving PDL leads to database');
      
      const savedLeads: Lead[] = [];
      
      for (const lead of leads) {
        try {
          const { data: savedLead, error } = await supabase
            .from('leads')
            .insert(lead)
            .select('*')
            .single();

          if (error) {
            if (error.code === '23505') {
              console.log('Lead already exists, skipping:', lead.email);
              continue;
            } else {
              console.error('Error saving individual PDL lead:', error);
              continue;
            }
          }

          if (savedLead) {
            savedLeads.push(savedLead);
          }
        } catch (individualError) {
          console.error('Error processing individual PDL lead:', individualError);
          continue;
        }
      }

      console.log('AssistantService: Successfully saved PDL leads:', savedLeads.length);
      return savedLeads;
    } catch (error) {
      console.error('AssistantService: Error in savePDLLeads:', error);
      return leads;
    }
  }

  private generateDemoLeads(searchQuery: string, requestedCount: number = 5): Lead[] {
    console.log('Generating demo leads for:', searchQuery, 'count:', requestedCount);
    
    // Parse the search query to extract job title and location
    const jobTitleMatch = this.extractJobTitle(searchQuery);
    const locationMatch = this.extractLocation(searchQuery);
    
    const techCompanies = [
      'DataFlow Systems', 'NextGen Analytics', 'CloudFirst Technologies', 'ByteForge Labs', 
      'SmartCode Solutions', 'DevStream Technologies', 'TechPulse SAS', 'DigitalMind Studio',
      'InnovTech Paris', 'CodeCraft Studio', 'SalesForce France', 'TechSales Pro',
      'SalesBoost SAS', 'RevenueTech', 'CommercialTech', 'SalesOptim'
    ];
    
    const frenchFirstNames = ['Alexandre', 'Sophie', 'Julien', 'Marine', 'Thomas', 'Camille', 'Nicolas', 'Amélie', 'Pierre', 'Claire'];
    const frenchLastNames = ['Martin', 'Dubois', 'Moreau', 'Lefebvre', 'Garcia', 'Roux', 'Fournier', 'Girard', 'Bernard', 'Durand'];
    
    // Default to Paris if no location specified
    const targetLocation = locationMatch || 'Paris';
    const targetJobTitle = jobTitleMatch || 'Responsable Commercial';
    
    console.log('Extracted job title:', targetJobTitle, 'location:', targetLocation);

    const leads: Lead[] = [];

    // Generate exactly the requested number of leads
    for (let i = 0; i < requestedCount; i++) {
      let firstName, lastName, fullName, email, company;
      let attempts = 0;
      
      // Ensure uniqueness
      do {
        firstName = frenchFirstNames[Math.floor(Math.random() * frenchFirstNames.length)];
        lastName = frenchLastNames[Math.floor(Math.random() * frenchLastNames.length)];
        fullName = `${firstName} ${lastName}`;
        company = techCompanies[Math.floor(Math.random() * techCompanies.length)];
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}.fr`;
        attempts++;
      } while ((this.generatedNames.has(fullName) || this.generatedEmails.has(email)) && attempts < 50);
      
      // If we couldn't find unique names after 50 attempts, add a number suffix
      if (attempts >= 50) {
        fullName = `${firstName} ${lastName}${i + 1}`;
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 1}@${company.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}.fr`;
      }
      
      this.generatedNames.add(fullName);
      this.generatedEmails.add(email);
      
      const lead: Lead = {
        id: crypto.randomUUID(),
        client_id: this.userId,
        full_name: fullName,
        job_title: targetJobTitle,
        company: company,
        location: targetLocation,
        email: email,
        phone_number: `+33 6${Math.floor(Math.random() * 90000000) + 10000000}`,
        linkedin_url: `linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`,
        status: 'new',
        created_at: new Date().toISOString(),
        enriched_from: {
          source: 'assistant_demo',
          timestamp: new Date().toISOString(),
          notes: `Generated from search: "${searchQuery}"`
        }
      };
      
      leads.push(lead);
    }

    console.log('Generated demo leads:', leads.length);
    return leads;
  }

  private extractJobTitle(searchQuery: string): string {
    const query = searchQuery.toLowerCase();
    
    // Map of keywords to job titles
    const jobTitleMappings = [
      { keywords: ['freelances', 'freelance', 'indépendant'], title: 'Freelance' },
      { keywords: ['vp sales', 'vice president sales', 'vice-président commercial'], title: 'VP Sales' },
      { keywords: ['directeur commercial', 'director sales'], title: 'Directeur Commercial' },
      { keywords: ['responsable commercial', 'sales manager'], title: 'Responsable Commercial' },
      { keywords: ['head of sales', 'chef des ventes'], title: 'Head of Sales' },
      { keywords: ['commercial senior', 'senior sales'], title: 'Commercial Senior' },
      { keywords: ['business developer', 'développeur commercial'], title: 'Business Developer' },
      { keywords: ['cto', 'directeur technique'], title: 'CTO' },
      { keywords: ['lead developer', 'développeur principal'], title: 'Lead Developer' },
      { keywords: ['product manager', 'chef de produit'], title: 'Product Manager' },
      { keywords: ['marketing manager', 'responsable marketing'], title: 'Marketing Manager' }
    ];

    for (const mapping of jobTitleMappings) {
      for (const keyword of mapping.keywords) {
        if (query.includes(keyword)) {
          return mapping.title;
        }
      }
    }

    return 'Responsable Commercial'; // Default
  }

  private extractLocation(searchQuery: string): string {
    const query = searchQuery.toLowerCase();
    const locations = ['paris', 'lyon', 'marseille', 'toulouse', 'nice', 'nantes', 'montpellier', 'strasbourg', 'bordeaux', 'lille'];
    
    for (const location of locations) {
      if (query.includes(location)) {
        return location.charAt(0).toUpperCase() + location.slice(1);
      }
    }
    
    return 'Paris'; // Default location
  }

  private async saveDemoLeads(leads: Lead[]): Promise<Lead[]> {
    try {
      console.log('AssistantService: Saving leads to database');
      
      // Insert leads one by one to handle conflicts better
      const savedLeads: Lead[] = [];
      
      for (const lead of leads) {
        try {
          const { data: savedLead, error } = await supabase
            .from('leads')
            .insert(lead)
            .select('*')
            .single();

          if (error) {
            // If it's a unique constraint error, try to update
            if (error.code === '23505') {
              console.log('Lead already exists, skipping:', lead.email);
              continue;
            } else {
              console.error('Error saving individual lead:', error);
              continue;
            }
          }

          if (savedLead) {
            savedLeads.push(savedLead);
          }
        } catch (individualError) {
          console.error('Error processing individual lead:', individualError);
          continue;
        }
      }

      console.log('AssistantService: Successfully saved leads:', savedLeads.length);
      return savedLeads;
    } catch (error) {
      console.error('AssistantService: Error in saveDemoLeads:', error);
      // Return original leads if save fails so UI can still update
      return leads;
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
