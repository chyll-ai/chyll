
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
  private onLeadsUpdate?: () => void;
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

  setLeadsUpdateCallback(callback: () => void) {
    this.onLeadsUpdate = callback;
    console.log('AssistantService: Leads update callback set');
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
        console.log('AssistantService: Detected search query, using search');
        
        // Extract number from query (default to 5 if not specified, max 10)
        const numberMatch = content.match(/(\d+)/);
        const requestedCount = Math.min(numberMatch ? parseInt(numberMatch[1]) : 5, 10);
        
        console.log(`AssistantService: Searching for ${requestedCount} leads`);
        
        try {
          // Call search function with the natural language query
          const { data: searchResult, error: searchError } = await supabase.functions
            .invoke('pdl-search', {
              body: {
                searchQuery: content,
                userId: this.userId,
                count: requestedCount
              }
            });

          if (searchError) {
            console.error('Search error:', searchError);
            throw searchError;
          }

          if (!searchResult.success) {
            throw new Error(searchResult.error || 'Search failed');
          }

          const leads = searchResult.leads || [];
          const message = searchResult.message || '';
          
          console.log('Search found:', leads.length, 'leads');

          if (leads.length > 0) {
            // Trigger leads refresh in the UI - this will call loadLeads()
            console.log('AssistantService: Triggering leads update callback...');
            if (this.onLeadsUpdate) {
              await this.onLeadsUpdate();
              console.log('AssistantService: Leads update callback executed');
            } else {
              console.warn('AssistantService: No leads update callback set');
            }
            
            toast.success(`${leads.length} leads trouvés et sauvegardés`);

            let responseMessage = `Excellent ! J'ai trouvé ${leads.length} leads pour "${content}" via People Data Labs.`;
            responseMessage += ' Ces contacts ont été sauvegardés dans votre base de données et sont maintenant visibles dans votre tableau de bord.';

            return { message: responseMessage };
          } else {
            let noResultsMessage = `Je n'ai pas trouvé de leads pour "${content}" dans la base de données People Data Labs.`;
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
