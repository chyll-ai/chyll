
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ChatMessage from '@/components/chat/ChatMessage';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

const Assistant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if user is authenticated and fetch messages
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          console.error("Pas de session trouvée:", sessionError);
          toast.error("Veuillez vous connecter pour accéder à cette page");
          navigate('/login');
          return;
        }
        
        const userId = sessionData.session.user.id;
        setUserId(userId);
        console.log("Session trouvée, ID utilisateur:", userId);
        
        // Create client record if it doesn't exist
        const { data: client, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (clientError) {
          console.error("Erreur lors de la vérification du client:", clientError);
          throw new Error("Erreur lors de la vérification du client");
        }
        
        if (!client) {
          console.log("Client non trouvé, création en cours...");
          await supabase
            .from('clients')
            .insert({
              id: userId,
              email: sessionData.session.user.email || ''
            });
          console.log("Client créé avec succès");
        }
        
        // Check if user has a profile
        const { data: profileData, error: profileError } = await supabase
          .from('client_profile')
          .select('*')
          .eq('client_id', userId)
          .maybeSingle();
          
        if (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError);
          throw new Error("Erreur lors de la récupération du profil");
        }
        
        setHasProfile(!!profileData);
        
        // Fetch chat messages
        await fetchMessages(userId);
        
        // If no profile exists and no welcome message yet, start onboarding
        if (!profileData && messages.length === 0) {
          await startOnboarding(userId);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Une erreur s'est produite");
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Set up real-time subscription for new messages
    const messagesChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: userId ? `client_id=eq.${userId}` : undefined
      }, (payload) => {
        if (payload.new && typeof payload.new === 'object') {
          const newMessage = payload.new as Message;
          setMessages(current => {
            // Check if the message already exists
            if (current.some(msg => msg.id === newMessage.id)) {
              return current;
            }
            return [...current, newMessage].sort((a, b) => 
              new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            );
          });
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, [navigate, userId]);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const fetchMessages = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: true });
        
      if (error) {
        throw error;
      }
      
      setMessages(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
      toast.error("Impossible de charger les messages");
    }
  };
  
  const startOnboarding = async (userId: string) => {
    if (!userId) return;
    
    // Insert welcome message
    try {
      const welcomeMessage = {
        client_id: userId,
        role: 'assistant' as const,
        content: "Bonjour ! Je suis votre assistant chyll. Pour bien vous accompagner dans votre prospection commerciale, j'ai besoin de quelques informations sur votre entreprise. Quel est le nom de votre entreprise ?"
      };
      
      const { error } = await supabase
        .from('messages')
        .insert([welcomeMessage]);
        
      if (error) throw error;
    } catch (error) {
      console.error("Erreur lors de l'envoi du message de bienvenue:", error);
    }
  };
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !userId || sending) return;
    
    try {
      setSending(true);
      
      // Insert user message
      const userMessage = {
        client_id: userId,
        role: 'user' as const,
        content: inputMessage.trim()
      };
      
      const { error: userMessageError } = await supabase
        .from('messages')
        .insert([userMessage]);
        
      if (userMessageError) throw userMessageError;
      
      // Clear input
      setInputMessage('');
      
      // Generate AI response based on user message and conversation context
      await processUserMessage(userId, inputMessage.trim());
      
      setSending(false);
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Impossible d'envoyer le message");
      setSending(false);
    }
  };
  
  const processUserMessage = async (userId: string, messageContent: string) => {
    try {
      // Show typing indicator
      const typingMessage = {
        client_id: userId,
        role: 'assistant' as const,
        content: "...",
        id: "typing-indicator"
      };
      
      setMessages([...messages, typingMessage as any]);
      
      // Check if we are in onboarding flow
      const { data: profileData } = await supabase
        .from('client_profile')
        .select('*')
        .eq('client_id', userId)
        .maybeSingle();
      
      // Generate appropriate response based on conversation state
      let responseContent = "";
      
      if (!profileData) {
        // We're in onboarding flow - Process based on previous messages
        const onboardingState = determineOnboardingState(messages);
        responseContent = await handleOnboardingState(userId, onboardingState, messageContent);
      } else {
        // Normal chat flow
        responseContent = "Maintenant que votre profil est configuré, je peux vous aider à générer des emails, lancer des recherches ou discuter de votre stratégie de prospection. Que souhaitez-vous faire ?";
      }
      
      // Remove typing indicator
      setMessages(messages.filter(msg => msg.id !== "typing-indicator"));
      
      // Insert AI response
      const aiResponse = {
        client_id: userId,
        role: 'assistant' as const,
        content: responseContent
      };
      
      await supabase
        .from('messages')
        .insert([aiResponse]);
        
    } catch (error) {
      console.error("Erreur lors du traitement du message:", error);
      // Remove typing indicator in case of error
      setMessages(messages.filter(msg => msg.id !== "typing-indicator"));
    }
  };
  
  const determineOnboardingState = (messages: Message[]): string => {
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      return 'welcome';
    }
    
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1].content.toLowerCase();
    
    if (lastAssistantMessage.includes('nom de votre entreprise')) {
      return 'company_name';
    } else if (lastAssistantMessage.includes('secteur d\'activité')) {
      return 'industry';
    } else if (lastAssistantMessage.includes('cible idéale')) {
      return 'icp';
    } else if (lastAssistantMessage.includes('proposition de valeur')) {
      return 'value_prop';
    } else if (lastAssistantMessage.includes('ton de communication')) {
      return 'tone';
    } else if (lastAssistantMessage.includes('objectif principal')) {
      return 'primary_goal';
    } else if (lastAssistantMessage.includes('lien calendly')) {
      return 'calendly';
    }
    
    return 'completed';
  };
  
  const handleOnboardingState = async (userId: string, state: string, userInput: string): Promise<string> => {
    // Store the collected info
    const profileUpdates: Record<string, string> = {};
    let nextQuestion = "";
    
    switch (state) {
      case 'company_name':
        profileUpdates.company_name = userInput;
        nextQuestion = `Merci ! Dans quel secteur d'activité opère ${userInput} ?`;
        break;
      
      case 'industry':
        profileUpdates.industry = userInput;
        nextQuestion = "Super ! Maintenant, décrivez votre cible idéale (titre du poste, taille d'entreprise) :";
        break;
      
      case 'icp':
        // Split ICP info into different fields
        const icpParts = userInput.split(',').map(part => part.trim());
        if (icpParts.length >= 1) profileUpdates.icp_title = icpParts[0];
        if (icpParts.length >= 2) profileUpdates.icp_size = icpParts[1];
        
        nextQuestion = "Quelle est votre proposition de valeur unique ? Comment aidez-vous vos clients ?";
        break;
      
      case 'value_prop':
        profileUpdates.value_prop = userInput;
        nextQuestion = "Quel ton de communication préférez-vous utiliser ? (formel, amical, direct, etc.)";
        break;
      
      case 'tone':
        profileUpdates.tone = userInput;
        nextQuestion = "Quel est votre objectif principal de prospection ? (rendez-vous, démo, appel de découverte)";
        break;
      
      case 'primary_goal':
        profileUpdates.primary_goal = userInput;
        nextQuestion = "Facultatif : Avez-vous un lien Calendly pour la prise de rendez-vous ? (répondez 'non' si vous n'en avez pas)";
        break;
      
      case 'calendly':
        if (userInput.toLowerCase() !== 'non') {
          profileUpdates.calendly_url = userInput;
        }
        
        // Final step - Create or update profile
        try {
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('client_profile')
            .select('id')
            .eq('client_id', userId)
            .maybeSingle();
          
          if (existingProfile) {
            // Update existing profile
            await supabase
              .from('client_profile')
              .update(profileUpdates)
              .eq('id', existingProfile.id);
          } else {
            // Create new profile
            const allProfileData = await collectAllProfileData(userId, messages);
            await supabase
              .from('client_profile')
              .insert([{ 
                client_id: userId,
                ...allProfileData
              }]);
          }
          
          setHasProfile(true);
          return "Parfait ! Votre profil est maintenant configuré. Je peux vous aider à générer des emails, lancer des recherches ou discuter de votre stratégie de prospection. Que souhaitez-vous faire ?";
        } catch (error) {
          console.error("Erreur lors de la création du profil:", error);
          return "Une erreur s'est produite lors de la création de votre profil. Veuillez réessayer.";
        }
      
      default:
        return "Je suis votre assistant chyll. Comment puis-je vous aider aujourd'hui ?";
    }
    
    // Update profile with collected info
    try {
      const { data: existingProfile } = await supabase
        .from('client_profile')
        .select('id')
        .eq('client_id', userId)
        .maybeSingle();
        
      if (existingProfile) {
        await supabase
          .from('client_profile')
          .update(profileUpdates)
          .eq('id', existingProfile.id);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
    
    return nextQuestion;
  };
  
  const collectAllProfileData = async (userId: string, messages: Message[]): Promise<Record<string, string>> => {
    const profileData: Record<string, string> = {};
    let companyName = "";
    let industry = "";
    let icp = "";
    let valueProposition = "";
    let tone = "";
    let primaryGoal = "";
    let calendlyUrl = "";
    
    // Extract onboarding information from conversation
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    const userMessages = messages.filter(msg => msg.role === 'user');
    
    for (let i = 0; i < assistantMessages.length; i++) {
      const assistantMsg = assistantMessages[i].content.toLowerCase();
      
      if (assistantMsg.includes('nom de votre entreprise') && i < userMessages.length) {
        companyName = userMessages[i].content;
      } else if (assistantMsg.includes('secteur d\'activité') && i < userMessages.length) {
        industry = userMessages[i].content;
      } else if (assistantMsg.includes('cible idéale') && i < userMessages.length) {
        icp = userMessages[i].content;
        // Split ICP info
        const icpParts = icp.split(',').map(part => part.trim());
        if (icpParts.length >= 1) profileData.icp_title = icpParts[0];
        if (icpParts.length >= 2) profileData.icp_size = icpParts[1];
      } else if (assistantMsg.includes('proposition de valeur') && i < userMessages.length) {
        valueProposition = userMessages[i].content;
      } else if (assistantMsg.includes('ton de communication') && i < userMessages.length) {
        tone = userMessages[i].content;
      } else if (assistantMsg.includes('objectif principal') && i < userMessages.length) {
        primaryGoal = userMessages[i].content;
      } else if (assistantMsg.includes('lien calendly') && i < userMessages.length) {
        const response = userMessages[i].content;
        if (response.toLowerCase() !== 'non') {
          calendlyUrl = response;
        }
      }
    }
    
    return {
      company_name: companyName,
      industry: industry,
      value_prop: valueProposition,
      tone: tone,
      primary_goal: primaryGoal,
      calendly_url: calendlyUrl,
    };
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="border-b p-4">
        <h1 className="text-2xl font-bold">Assistant chyll</h1>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage key={message.id || index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <footer className="border-t p-4 bg-background">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tapez votre message..."
            disabled={sending}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!inputMessage.trim() || sending}
          >
            <Send className="h-4 w-4 mr-2" />
            Envoyer
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default Assistant;
