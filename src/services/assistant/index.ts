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
  private recentSearches: Map<string, { timestamp: number; results: Lead[] }> = new Map();

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

  private checkRecentSearch(searchQuery: string): Lead[] | null {
    const cacheKey = searchQuery.toLowerCase().trim();
    const cached = this.recentSearches.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      console.log('AssistantService: Found recent search results in cache');
      return cached.results;
    }
    
    return null;
  }

  private cacheSearchResults(searchQuery: string, results: Lead[]) {
    const cacheKey = searchQuery.toLowerCase().trim();
    this.recentSearches.set(cacheKey, {
      timestamp: Date.now(),
      results: [...results]
    });
    
    // Clean old cache entries (keep only last 10)
    if (this.recentSearches.size > 10) {
      const oldestKey = Array.from(this.recentSearches.keys())[0];
      this.recentSearches.delete(oldestKey);
    }
  }

  async sendMessage(content: string): Promise<{ message: string }> {
    try {
      console.log('AssistantService: Sending message:', { content, userId: this.userId });

      // Enhanced search detection with better logging
      if (this.isSearchQuery(content)) {
        console.log('AssistantService: Detected search query, using PDL search');
        
        // Check for recent identical searches
        const cachedResults = this.checkRecentSearch(content);
        if (cachedResults && cachedResults.length > 0) {
          console.log('AssistantService: Using cached search results');
          
          if (this.onLeadsUpdate) {
            this.onLeadsUpdate(cachedResults);
          }
          
          return {
            message: `J'ai trouvé ${cachedResults.length} leads dans votre recherche récente pour "${content}". Ces résultats sont mis en cache pour éviter les doublons.`
          };
        }
        
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
          const message = searchResult.message || '';
          const existingLeadsExcluded = searchResult.existingLeadsExcluded || 0;
          
          console.log('PDL search found:', leads.length, 'leads');
          console.log('Existing leads excluded:', existingLeadsExcluded);

          if (leads.length > 0) {
            // Save leads to database with enhanced duplicate detection
            const savedLeads = await this.savePDLLeadsWithDuplicateCheck(leads);
            
            // Cache the successful search results
            this.cacheSearchResults(content, savedLeads);
            
            if (this.onLeadsUpdate) {
              this.onLeadsUpdate(savedLeads);
            }
            
            toast.success(`${savedLeads.length} nouveaux leads trouvés via People Data Labs`);

            let responseMessage = `Excellent ! J'ai trouvé ${savedLeads.length} leads professionnels réels pour "${content}" via People Data Labs.`;
            
            if (existingLeadsExcluded > 0) {
              responseMessage += ` J'ai automatiquement exclu ${existingLeadsExcluded} leads existants pour éviter les doublons.`;
            }
            
            responseMessage += ' Ces contacts ont été enrichis avec des données réelles et ajoutés à votre tableau de bord.';

            return { message: responseMessage };
          } else {
            let noResultsMessage = `Je n'ai pas trouvé de nouveaux leads pour "${content}" dans la base de données People Data Labs.`;
            
            if (existingLeadsExcluded > 0) {
              noResultsMessage += ` Cependant, j'ai trouvé ${existingLeadsExcluded} résultats qui correspondent à des leads déjà présents dans votre base de données.`;
            }
            
            noResultsMessage += ' Essayez d\'utiliser des termes plus spécifiques, différents mots-clés, ou une localisation différente pour obtenir de nouveaux résultats.';
            
            return { message: noResultsMessage };
          }
        } catch (error) {
          console.error('PDL search failed:', error);
          
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          if (errorMessage.includes('PDL API key') || errorMessage.includes('not configured')) {
            return {
              message: `Impossible d'effectuer la recherche : la clé API People Data Labs n'est pas configurée. Veuillez configurer votre clé API PDL pour utiliser la recherche de données réelles.`
            };
          }
          
          return {
            message: `Désolé, j'ai rencontré une erreur lors de la recherche PDL pour "${content}". Veuillez réessayer ou vérifier votre configuration API.`
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

  private async savePDLLeadsWithDuplicateCheck(leads: Lead[]): Promise<Lead[]> {
    try {
      console.log('AssistantService: Saving PDL leads with enhanced duplicate checking');
      
      // Pre-check for existing emails in database
      const leadEmails = leads.map(lead => lead.email?.toLowerCase()).filter(Boolean);
      const { data: existingLeads } = await supabase
        .from('leads')
        .select('email')
        .eq('client_id', this.userId)
        .in('email', leadEmails);
      
      const existingEmailsSet = new Set(
        (existingLeads || []).map(lead => lead.email?.toLowerCase()).filter(Boolean)
      );
      
      console.log('Found existing emails in database:', existingEmailsSet.size);
      
      const savedLeads: Lead[] = [];
      
      for (const lead of leads) {
        // Skip if email already exists
        if (lead.email && existingEmailsSet.has(lead.email.toLowerCase())) {
          console.log('Skipping duplicate email:', lead.email);
          continue;
        }
        
        try {
          const { data: savedLead, error } = await supabase
            .from('leads')
            .insert(lead)
            .select('*')
            .single();

          if (error) {
            if (error.code === '23505') {
              console.log('Lead already exists during insert, skipping:', lead.email);
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
      console.error('AssistantService: Error in savePDLLeadsWithDuplicateCheck:', error);
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
