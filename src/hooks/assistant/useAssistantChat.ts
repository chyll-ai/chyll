import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Message, AssistantState } from '@/types/assistant';
import { handleFunctionCall } from '@/lib/handleFunctionCall';
import { isProfileQuestion } from './profileUtils';
import { 
  createThread, 
  fetchMessages, 
  sendWelcomeMessage,
  sendMessageToOpenAI,
  updateMessageWithToolCalls
} from './apiService';

export { handleFunctionCall } from '@/lib/handleFunctionCall';

const useAssistantChat = (): AssistantState => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [profileOnboarding, setProfileOnboarding] = useState<{ [key: string]: string }>({});
  const [lastProfileQuestion, setLastProfileQuestion] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  // Check if user is authenticated and fetch messages
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          console.error("Pas d'utilisateur trouvé:", userError);
          toast.error("Veuillez vous connecter pour accéder à cette page");
          navigate('/login');
          return;
        }
        
        const userId = userData.user.id;
        setUserId(userId);
        console.log("Utilisateur trouvé, ID:", userId);
        
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
              email: userData.user.email || ''
            });
          console.log("Client créé avec succès");
        }
        
        // Check if user has a profile
        const { data: profileData, error: profileError } = await supabase
          .from('client_profile')
          .select('*, is_complete')
          .eq('client_id', userId)
          .maybeSingle();
          
        if (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError);
          throw new Error("Erreur lors de la récupération du profil");
        }
        
        const profileExists = profileData && profileData.is_complete === true;
        setHasProfile(profileExists);
        
        // Get or create conversation
        const currentConversation = await getOrCreateConversation(userId, profileExists);
        setConversationId(currentConversation.id);
        console.log("Conversation active ID:", currentConversation.id);
        
        // Fetch chat messages for this conversation
        const messagesData = await fetchMessagesForConversation(userId, currentConversation.id);
        setMessages(messagesData);
        
        // Check if any assistant messages exist, and if not, send a welcome message
        const assistantMessages = messagesData.filter(msg => msg.role === 'assistant');
        if (assistantMessages.length === 0) {
          console.log("Aucun message assistant trouvé, envoi d'un message de bienvenue...");
          const welcomeMessage = profileExists
            ? "Parfait ! Votre profil est configuré. Commençons par générer une liste de prospects qualifiés pour votre business. Voulez-vous que je lance une recherche de leads correspondant à votre cible ?"
            : "Bienvenue ! Pour commencer, j'ai besoin de mieux comprendre votre cible et votre offre. On y va ?";
          
          const welcomeMsg = await sendWelcomeMessage(userId, welcomeMessage, currentConversation.id);
          if (welcomeMsg) {
            setMessages(prev => [...prev, welcomeMsg]);
          }
        }
        
        // Create a new thread if needed
        if (!threadId) {
          try {
            const thread = await createThread();
            console.log("Thread créé:", thread);
            setThreadId(thread.threadId);
            localStorage.setItem('openai_thread_id', thread.threadId);
          } catch (error) {
            console.error("Erreur lors de la création du thread:", error);
            // Continue without a thread as it's not critical for initial loading
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Une erreur s'est produite lors du chargement");
        setLoading(false);
      }
    };
    
    // Try to get existing threadId from localStorage
    const storedThreadId = localStorage.getItem('openai_thread_id');
    if (storedThreadId) {
      setThreadId(storedThreadId);
    }
    
    checkAuth();
  }, [navigate, messages.length]);

  // Helper function to get or create a conversation
  const getOrCreateConversation = async (userId: string, hasProfile: boolean) => {
    try {
      // Try to get the most recent conversation based on profile status
      const conversationType = hasProfile ? 'campaign' : 'onboarding';
      
      console.log(`Recherche d'une conversation existante de type ${conversationType} pour l'utilisateur ${userId}`);
      
      const { data: existingConversations, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('client_id', userId)
        .eq('type', conversationType)
        .order('createdAt', { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Erreur lors de la récupération des conversations:", error);
        throw error;
      }
      
      // If conversation exists, return it
      if (existingConversations && existingConversations.length > 0) {
        console.log("Conversation existante trouvée:", existingConversations[0]);
        return existingConversations[0];
      }
      
      // Otherwise, create a new conversation
      console.log("Aucune conversation existante, création d'une nouvelle...");
      
      const { data: newConversation, error: insertError } = await supabase
        .from('conversations')
        .insert([{
          client_id: userId,
          type: conversationType,
          title: hasProfile ? "Nouvelle campagne" : "Onboarding"
        }])
        .select()
        .single();
      
      if (insertError) {
        console.error("Erreur lors de la création d'une conversation:", insertError);
        throw insertError;
      }
      
      console.log("Nouvelle conversation créée:", newConversation);
      return newConversation;
    } catch (error) {
      console.error("Erreur dans getOrCreateConversation:", error);
      throw error;
    }
  };
  
  // Helper function to fetch messages for a specific conversation
  const fetchMessagesForConversation = async (userId: string, conversationId: string): Promise<Message[]> => {
    try {
      console.log(`Récupération des messages pour la conversation ${conversationId}`);
      
      // Fixed query: Using proper parameter format instead of string concatenation
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', userId)
        .eq('conversation_id', conversationId)
        .order('createdAt', { ascending: true });
      
      if (error) {
        console.error("Erreur lors de la récupération des messages:", error);
        throw error;
      }
      
      // Type cast the data to ensure role is either 'user' or 'assistant'
      const typedMessages: Message[] = data?.map(msg => {
        const role = (msg.role === 'user' || msg.role === 'assistant') 
          ? msg.role as 'user' | 'assistant'
          : 'assistant'; // Default fallback
          
        const message: Message = {
          id: msg.id,
          role: role,
          content: msg.content,
          createdAt: msg.createdAt
        };
        
        // Only add toolCalls if they exist in the database message
        if (msg.toolCalls) {
          message.toolCalls = Array.isArray(msg.toolCalls) ? msg.toolCalls : [];
        }
        
        return message;
      }) || [];
      
      console.log(`Récupération de ${typedMessages.length} messages pour la conversation ${conversationId}`);
      return typedMessages;
    } catch (error) {
      console.error("Erreur dans fetchMessagesForConversation:", error);
      return [];
    }
  };

  // Set up real-time subscription for new messages
  useEffect(() => {
    let messagesChannel: any;
    
    if (userId && conversationId) {
      messagesChannel = setupSubscription(userId, conversationId);
    }
    
    return () => {
      if (messagesChannel) {
        supabase.removeChannel(messagesChannel);
      }
    };
  }, [userId, conversationId]);

  // Track profile questions and update profile when enough data is collected
  useEffect(() => {
    const updateProfileIfNeeded = async () => {
      // Only proceed if we have at least company_name and one other field
      if (userId && profileOnboarding.company_name && Object.keys(profileOnboarding).length >= 2) {
        try {
          console.log("Attempting to create user profile with:", profileOnboarding);
          
          // Check if profile already exists
          const { data: existingProfile } = await supabase
            .from('client_profile')
            .select('*')
            .eq('client_id', userId)
            .maybeSingle();
            
          if (existingProfile) {
            // Update existing profile
            const { error } = await supabase
              .from('client_profile')
              .update({
                ...profileOnboarding,
                is_complete: true
              })
              .eq('client_id', userId);
              
            if (error) throw error;
            toast.success("Votre profil a été mis à jour avec succès!");
          } else {
            // Create new profile
            const { error } = await supabase
              .from('client_profile')
              .insert({
                client_id: userId,
                ...profileOnboarding,
                is_complete: true
              });
              
            if (error) throw error;
            toast.success("Votre profil a été créé avec succès!");
          }
          
          // Update local state to reflect that user now has a profile
          setHasProfile(true);
          
          // Send a confirmation message from the assistant with focus on lead generation
          setTimeout(() => {
            sendMessage("Excellent ! Votre profil est maintenant complet. La prochaine étape est de générer une liste de prospects qualifiés pour votre business. Voulez-vous que je lance une recherche de leads correspondant exactement à votre cible ?");
          }, 1000);
          
        } catch (error) {
          console.error("Erreur lors de la mise à jour du profil:", error);
          toast.error("Une erreur s'est produite lors de la mise à jour de votre profil.");
        }
      }
    };
    
    updateProfileIfNeeded();
  }, [profileOnboarding, userId]);

  // Process new assistant messages to detect profile questions
  useEffect(() => {
    if (!messages.length || hasProfile) return;
    
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    if (assistantMessages.length === 0) return;
    
    const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
    const fieldType = isProfileQuestion(lastAssistantMessage.content);
    
    if (fieldType) {
      console.log("Detected profile question about:", fieldType);
      setLastProfileQuestion(fieldType);
    }
  }, [messages, hasProfile]);

  // Process user responses to profile questions
  useEffect(() => {
    if (!lastProfileQuestion || !messages.length || hasProfile) return;
    
    const userMessages = messages.filter(msg => msg.role === 'user');
    if (userMessages.length === 0) return;
    
    const lastUserMessage = userMessages[userMessages.length - 1];
    // Make sure this is a recent message (within the last 5 messages)
    const lastIndex = messages.findIndex(msg => msg.id === lastUserMessage.id);
    
    if (messages.length - lastIndex <= 5) {
      // Store user's answer to the last profile question
      setProfileOnboarding(prev => ({
        ...prev,
        [lastProfileQuestion]: lastUserMessage.content
      }));
      
      console.log(`Stored ${lastProfileQuestion} as: ${lastUserMessage.content}`);
      setLastProfileQuestion(null);
    }
  }, [messages, lastProfileQuestion, hasProfile]);

  const setupSubscription = (userId: string, conversationId: string) => {
    const messagesChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `client_id=eq.${userId} AND conversation_id=eq.${conversationId}`
      }, (payload) => {
        if (payload.new && typeof payload.new === 'object') {
          const newMessage = payload.new as any;
          if (newMessage.role === 'user' || newMessage.role === 'assistant') {
            setMessages(current => {
              // Check if the message already exists
              if (current.some(msg => msg.id === newMessage.id)) {
                return current;
              }
              // Cast role to 'user' | 'assistant' type
              const role = newMessage.role as 'user' | 'assistant';
              const typedMessage: Message = {
                id: newMessage.id,
                role: role,
                content: newMessage.content,
                createdAt: newMessage.createdAt,
                // Only add toolCalls if they exist in the message
                ...(newMessage.toolCalls && { toolCalls: newMessage.toolCalls })
              };
              
              // If this is an assistant message, stop the typing indicator
              if (role === 'assistant') {
                setIsGenerating(false);
              }
              
              return [...current, typedMessage].sort((a, b) => 
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
              );
            });
          }
        }
      })
      .subscribe((status) => {
        console.log("Status de souscription:", status);
      });
    
    return messagesChannel;
  };

  const createMessage = (content: string, role: 'user' | 'assistant', toolCalls?: any[]) => ({
    id: crypto.randomUUID(),
    content,
    role,
    toolCalls,
    createdAt: new Date().toISOString()
  });

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !userId || !conversationId) {
      console.log("Message vide, utilisateur non connecté ou conversation non définie");
      return;
    }
    
    if (sending) {
      console.log("Envoi déjà en cours, veuillez patienter");
      return;
    }
    
    try {
      setSending(true);
      setIsGenerating(true);
      
      // Create a temporary message to display immediately in the UI
      const tempUserMessage = createMessage(content, 'user');
      
      // Update the UI immediately with the user message
      setMessages(prev => [...prev, tempUserMessage]);
      
      // 1. Insert user message
      const userMessage = createMessage(content, 'user');
      
      console.log("Envoi du message utilisateur à Supabase:", userMessage);
      const { data: userMessageData, error: userMessageError } = await supabase
        .from('messages')
        .insert([userMessage])
        .select();
        
      if (userMessageError) {
        console.error("Erreur lors de l'insertion du message utilisateur:", userMessageError);
        throw userMessageError;
      }
      
      // Replace the temporary message with the actual one from the database
      if (userMessageData && userMessageData.length > 0) {
        console.log("Message utilisateur enregistré avec succès:", userMessageData[0]);
        setMessages(prev => prev.map(msg => 
          msg.id === tempUserMessage.id ? {
            id: userMessageData[0].id,
            role: 'user',
            content: userMessageData[0].content,
            createdAt: userMessageData[0].createdAt
          } : msg
        ));
      }
      
      // 2. Verify or create thread if needed
      let currentThreadId = threadId;
      if (!currentThreadId) {
        console.log("Pas de thread existant, création d'un nouveau thread...");
        try {
          const thread = await createThread();
          currentThreadId = thread.threadId;
          setThreadId(currentThreadId);
          localStorage.setItem('openai_thread_id', currentThreadId);
          console.log("Nouveau thread créé:", currentThreadId);
        } catch (threadError) {
          console.error("Erreur lors de la création du thread:", threadError);
          toast.error("Erreur de communication avec l'assistant");
          setSending(false);
          setIsGenerating(false);
          return;
        }
      }
      
      // 3. Send message to OpenAI and get response
      console.log("Envoi du message à OpenAI avec threadId:", currentThreadId);
      const data = await sendMessageToOpenAI(currentThreadId, content.trim());
      
      // Store the current run ID
      if (data.runId) {
        setCurrentRunId(data.runId);
      }
      
      // 4. Insert assistant's response
      const assistantMessage = createMessage(data.message, 'assistant', data.toolCalls);
      
      console.log("Enregistrement de la réponse de l'assistant:", assistantMessage);
      const { data: assistantMessageData, error: assistantMessageError } = await supabase
        .from('messages')
        .insert([assistantMessage])
        .select();
        
      if (assistantMessageError) {
        console.error("Erreur lors de l'enregistrement de la réponse de l'assistant:", assistantMessageError);
        throw assistantMessageError;
      }
      
      // The typing indicator will be stopped by the subscription when the assistant message is received
      // or manually stop it here if the subscription doesn't fire
      if (assistantMessageData && assistantMessageData.length > 0) {
        console.log("Réponse de l'assistant enregistrée avec succès:", assistantMessageData[0]);
        setMessages(prev => [...prev, assistantMessage]);
        setIsGenerating(false);
      }
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Impossible d'envoyer le message");
      setIsGenerating(false);
    } finally {
      setSending(false);
    }
  }, [userId, conversationId, sending, threadId]);

  // Add effect to handle response completion
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        setIsGenerating(false);
      }
    }
  }, [messages]);

  return {
    loading,
    sending,
    isGenerating,
    messages,
    sendMessage,
    userId,
    hasProfile,
    threadId,
    currentRunId,
    conversationId
  };
};

export default useAssistantChat;
