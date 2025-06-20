
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, Loader2 } from 'lucide-react';
import { useAssistantActions } from '@/hooks/useAssistantActions';
import { AssistantService } from '@/services/assistant/index';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface WorkspaceAssistantProps {
  onLeadsUpdate?: () => void;
}

const WorkspaceAssistant: React.FC<WorkspaceAssistantProps> = ({ onLeadsUpdate }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Bonjour ! Je suis votre assistant CRM. Je peux vous aider à trouver des leads, enrichir vos prospects, envoyer des emails, et bien plus. Essayez de me demander : 'Trouve-moi 5 leads RH à Paris'",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [assistantService, setAssistantService] = useState<AssistantService | null>(null);
  
  const { user } = useAuth();
  const { assistantActions, leads, filteredLeads } = useAssistantActions();

  // Initialize AssistantService
  useEffect(() => {
    if (user && !assistantService) {
      const service = new AssistantService(user.id);
      // Set up the leads update callback to properly refresh data
      service.setLeadsUpdateCallback(async () => {
        console.log('Leads update callback triggered - refreshing data...');
        // Trigger a full reload of leads from the database
        await assistantActions.loadLeads();
        // Also trigger the parent component's update callback
        onLeadsUpdate?.();
      });
      setAssistantService(service);
    }
  }, [user, assistantService, onLeadsUpdate, assistantActions]);

  // Enhanced search detection
  const isSearchQuery = (content: string): boolean => {
    const lowerContent = content.toLowerCase();
    
    const searchPatterns = [
      // French search terms
      'trouve', 'cherche', 'recherche', 'trouve-moi', 'trouvez', 'cherchez',
      'trouver', 'chercher', 'rechercher', 'localise', 'localiser',
      
      // English search terms
      'find', 'search', 'look for', 'get me', 'show me', 'fetch',
      
      // Lead/contact/profile related terms
      'leads', 'prospects', 'contacts', 'profils', 'profiles',
      'personnes', 'people', 'candidats', 'candidates',
      
      // Industry/role specific terms
      'freelances', 'freelance', 'indépendant', 'developers', 'développeurs',
      'commerciaux', 'sales', 'managers', 'directeurs', 'cto', 'ceo', 'rh',
      
      // Location-based searches
      'à paris', 'in paris', 'à lyon', 'in london', 'en france', 'in france',
      
      // Action words for search
      'list', 'liste', 'affiche', 'show', 'montre', 'display'
    ];

    return searchPatterns.some(pattern => lowerContent.includes(pattern));
  };

  const processUserInput = async (userMessage: string) => {
    setProcessing(true);
    
    try {
      let response = '';
      const lowerInput = userMessage.toLowerCase();

      // Check if this is a search query that should use external search API
      if (isSearchQuery(userMessage)) {
        console.log('WorkspaceAssistant: Detected search query, using AssistantService search');
        
        if (assistantService) {
          try {
            const result = await assistantService.sendMessage(userMessage);
            response = result.message;
            // The callback will be triggered automatically from AssistantService
          } catch (error) {
            console.error('Search failed:', error);
            response = "Désolé, j'ai rencontré une erreur lors de la recherche de leads. Veuillez vérifier votre configuration API.";
          }
        } else {
          response = "Assistant non initialisé. Veuillez rafraîchir la page.";
        }
      }
      // Handle other assistant actions
      else if (lowerInput.includes('enrichis') && lowerInput.includes('non qualifiés')) {
        await assistantActions.enrichNonQualifiedLeads();
        response = `J'ai lancé l'enrichissement de ${leads.filter(l => l.status === 'new').length} leads non qualifiés.`;
      }
      else if (lowerInput.includes('leads saas') || lowerInput.includes('montre-moi les leads saas')) {
        const saasLeads = assistantActions.showSaaSLeads();
        response = `J'ai trouvé ${saasLeads.length} leads liés au SaaS. Ils sont maintenant affichés dans le tableau.`;
      }
      else if (lowerInput.includes('enrichis tous les leads')) {
        await assistantActions.enrichLeadsAction();
        response = `J'ai lancé l'enrichissement de ${filteredLeads.length} leads sélectionnés.`;
      }
      else if (lowerInput.includes('envoie') && lowerInput.includes('mail')) {
        await assistantActions.sendEmailsAction();
        response = `J'ai envoyé des emails à ${filteredLeads.filter(l => l.email).length} leads avec email.`;
      }
      else if (lowerInput.includes('relance')) {
        await assistantActions.sendFollowUpEmails();
        response = `J'ai envoyé des emails de relance aux leads marqués "à relancer".`;
      }
      else if (lowerInput.includes('hier') || lowerInput.includes('yesterday')) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayLeads = assistantActions.getLeadsByDate(yesterday.toISOString());
        response = `J'ai trouvé ${yesterdayLeads.length} leads ajoutés hier. Ils sont maintenant affichés.`;
      }
      else if (lowerInput.includes('statut') && lowerInput.includes('contacté')) {
        const contactedLeads = assistantActions.getLeadsByStatus('contacted');
        response = `Voici ${contactedLeads.length} leads avec le statut "contacté".`;
      }
      else if (lowerInput.includes('charge') || lowerInput.includes('actualise')) {
        await assistantActions.loadLeads();
        response = "J'ai actualisé la liste des leads.";
      }
      else {
        response = "Je n'ai pas compris votre demande. Voici ce que je peux faire :\n\n• Trouver des leads via notre base de données (ex: 'trouve-moi 5 leads RH à Paris')\n• Enrichir les leads non qualifiés\n• Filtrer les leads (ex: 'montre-moi les leads SaaS')\n• Envoyer des emails aux leads\n• Afficher les leads par statut ou date\n• Actualiser la liste des leads";
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error: any) {
      console.error('Error processing assistant action:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Désolé, j'ai rencontré une erreur lors de l'exécution de votre demande. Veuillez réessayer.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Erreur lors du traitement de la demande');
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || processing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    await processUserInput(currentInput);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Assistant CRM
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 p-4 space-y-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {processing && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground rounded-lg px-3 py-2 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Traitement en cours...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex-shrink-0 flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Exemple: 'Trouve-moi 5 leads RH à Paris' ou 'Enrichis mes leads'"
            className="flex-1 min-h-[60px] resize-none"
            disabled={processing}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || processing}
            className="self-end"
          >
            {processing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkspaceAssistant;
