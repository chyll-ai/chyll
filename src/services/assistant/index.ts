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
    console.log('AssistantService: Initialized for user:', userId);
  }

  setMessages(messages: Message[]) {
    this.messages = messages;
  }

  setLeadsUpdateCallback(callback: (leads: Lead[]) => void) {
    this.onLeadsUpdate = callback;
  }

  private isSearchQuery(content: string): boolean {
    const lowerContent = content.toLowerCase();
    
    // Enhanced search detection patterns - much more comprehensive
    const searchPatterns = [
      // French search terms
      'trouve', 'cherche', 'recherche', 'trouve-moi', 'trouvez', 'cherchez',
      'trouver', 'chercher', 'rechercher', 'localise', 'localiser', 'obtenir',
      'récupère', 'récupérer', 'identifier', 'dénicher', 'pêcher',
      
      // English search terms  
      'find', 'search', 'look for', 'get me', 'show me', 'fetch', 'retrieve',
      'locate', 'discover', 'identify', 'acquire', 'obtain',
      
      // Lead/contact/profile related terms
      'leads', 'prospects', 'contacts', 'profils', 'profiles', 'candidats',
      'personnes', 'people', 'candidates', 'professionnels', 'professionals',
      
      // Industry/role terms (broader detection)
      'rh', 'ressources humaines', 'human resources', 'hr',
      'commercial', 'commerciaux', 'sales', 'ventes', 'vendeur', 'vendeurs',
      'développeur', 'développeurs', 'developer', 'developers', 'dev',
      'manager', 'managers', 'directeur', 'directeurs', 'director', 'directors',
      'cto', 'ceo', 'cmo', 'cfo', 'responsable', 'chef', 'head of',
      
      // Action indicators
      'besoin de', 'j\'ai besoin', 'il me faut', 'peux-tu', 'pouvez-vous',
      'i need', 'can you', 'could you', 'help me find', 'aide-moi'
    ];

    // Check if the message contains any search patterns
    const hasSearchPattern = searchPatterns.some(pattern => lowerContent.includes(pattern));
    
    // Also check for number + "leads" pattern (e.g., "5 leads", "10 prospects")
    const hasNumberLeadPattern = /\d+\s*(leads?|prospects?|contacts?|profils?)/i.test(content);
    
    return hasSearchPattern || hasNumberLeadPattern;
  }

  async sendMessage(content: string): Promise<{ message: string }> {
    try {
      console.log('AssistantService: Sending message:', { content, userId: this.userId });

      // Enhanced search detection with better logging
      if (this.isSearchQuery(content)) {
        console.log('AssistantService: Detected search query, using PDL search');
        
        // Extract number from query (default to 5 if not specified, max 10)
        const numberMatch = content.match(/(\d+)/);
        const requestedCount = Math.min(numberMatch ? parseInt(numberMatch[1]) : 5, 10);
        
        console.log(`AssistantService: Searching with PDL for ${requestedCount} leads`);
        
        try {
          // Call PDL search function with the natural language query
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
              message: `Je n'ai pas trouvé de leads correspondant exactement à votre recherche "${content}". Essayez d'utiliser des termes plus généraux ou différents mots-clés.`
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
    
    const techCompanies = [
      'DataFlow Systems', 'NextGen Analytics', 'CloudFirst Technologies', 'ByteForge Labs', 
      'SmartCode Solutions', 'DevStream Technologies', 'TechPulse SAS', 'DigitalMind Studio',
      'InnovTech Paris', 'CodeCraft Studio', 'SalesForce France', 'TechSales Pro',
      'SalesBoost SAS', 'RevenueTech', 'CommercialTech', 'SalesOptim'
    ];
    
    const frenchFirstNames = ['Alexandre', 'Sophie', 'Julien', 'Marine', 'Thomas', 'Camille', 'Nicolas', 'Amélie', 'Pierre', 'Claire'];
    const frenchLastNames = ['Martin', 'Dubois', 'Moreau', 'Lefebvre', 'Garcia', 'Roux', 'Fournier', 'Girard', 'Bernard', 'Durand'];
    
    // Use Paris as default location and "Responsable Commercial" as default job title
    const targetLocation = 'Paris';
    const targetJobTitle = 'Responsable Commercial';

    const leads: Lead[] = [];

    for (let i = 0; i < requestedCount; i++) {
      let firstName, lastName, fullName, email, company;
      let attempts = 0;
      
      do {
        firstName = frenchFirstNames[Math.floor(Math.random() * frenchFirstNames.length)];
        lastName = frenchLastNames[Math.floor(Math.random() * frenchLastNames.length)];
        fullName = `${firstName} ${lastName}`;
        company = techCompanies[Math.floor(Math.random() * techCompanies.length)];
        email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '').replace(/'/g, '')}.fr`;
        attempts++;
      } while ((this.generatedNames.has(fullName) || this.generatedEmails.has(email)) && attempts < 50);
      
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

  private async saveDemoLeads(leads: Lead[]): Promise<Lead[]> {
    try {
      console.log('AssistantService: Saving leads to database');
      
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
