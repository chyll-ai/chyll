
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Message } from './types';
import { handleFunctionCall } from './toolCallHandlers';
import { isProfileQuestion } from './profileUtils';
import { 
  createThread, 
  fetchMessages, 
  sendWelcomeMessage,
  sendMessageToOpenAI,
  updateMessageWithToolCalls
} from './apiService';

export { handleFunctionCall };

const useAssistantChat = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [profileOnboarding, setProfileOnboarding] = useState<{ [key: string]: string }>({});
  const [lastProfileQuestion, setLastProfileQuestion] = useState<string | null>(null);

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
          .select('*')
          .eq('client_id', userId)
          .maybeSingle();
          
        if (profileError) {
          console.error("Erreur lors de la récupération du profil:", profileError);
          throw new Error("Erreur lors de la récupération du profil");
        }
        
        const profileExists = !!profileData;
        setHasProfile(profileExists);
        
        // Fetch chat messages
        const messagesData = await fetchMessages(userId);
        setMessages(messagesData);
        
        // Check if any assistant messages exist, and if not, send a welcome message
        const assistantMessages = messagesData.filter(msg => msg.role === 'assistant');
        if (assistantMessages.length === 0) {
          console.log("Aucun message assistant trouvé, envoi d'un message de bienvenue...");
          const welcomeMessage = profileExists
            ? "Maintenant que votre profil est configuré, je peux vous aider à générer des emails..."
            : "Bienvenue ! Pour commencer, j'ai besoin de mieux comprendre votre cible et votre offre. On y va ?";
          
          const welcomeMsg = await sendWelcomeMessage(userId, welcomeMessage);
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

  // Set up real-time subscription for new messages
  useEffect(() => {
    let messagesChannel: any;
    
    if (userId) {
      messagesChannel = setupSubscription(userId);
    }
    
    return () => {
      if (messagesChannel) {
        supabase.removeChannel(messagesChannel);
      }
    };
  }, [userId]);

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
              .update(profileOnboarding)
              .eq('client_id', userId);
              
            if (error) throw error;
            toast.success("Votre profil a été mis à jour avec succès!");
          } else {
            // Create new profile
            const { error } = await supabase
              .from('client_profile')
              .insert({
                client_id: userId,
                ...profileOnboarding
              });
              
            if (error) throw error;
            toast.success("Votre profil a été créé avec succès!");
          }
          
          // Update local state to reflect that user now has a profile
          setHasProfile(true);
          
          // Send a confirmation message from the assistant
          setTimeout(() => {
            sendMessage("Parfait! Votre profil a été enregistré. Je peux maintenant vous aider à générer des emails et messages personnalisés pour votre prospection.");
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

  const setupSubscription = (userId: string) => {
    const messagesChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `client_id=eq.${userId}`
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
                created_at: newMessage.created_at,
                // Only add toolCalls if they exist in the message
                ...(newMessage.toolCalls && { toolCalls: newMessage.toolCalls })
              };
              return [...current, typedMessage].sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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

  const sendMessage = async (content: string) => {
    if (!content.trim() || !userId) {
      console.log("Message vide ou utilisateur non connecté");
      return;
    }
    
    if (sending) {
      console.log("Envoi déjà en cours, veuillez patienter");
      return;
    }
    
    try {
      setSending(true);
      
      // Create a temporary message to display immediately in the UI
      const tempUserMessage: Message = {
        id: "temp-" + Date.now(),
        role: 'user',
        content: content.trim(),
        created_at: new Date().toISOString()
      };
      
      // Update the UI immediately with the user message
      setMessages(prev => [...prev, tempUserMessage]);
      
      // 1. Insert user message
      const userMessage = {
        client_id: userId,
        role: 'user' as const,
        content: content.trim()
      };
      
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
            created_at: userMessageData[0].created_at
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
          return;
        }
      }
      
      // Show typing indicator
      const typingMessage: Message = {
        id: "typing-indicator",
        role: 'assistant',
        content: "...",
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, typingMessage]);
      
      // 3. Send message to OpenAI and get response
      console.log("Envoi du message à OpenAI avec threadId:", currentThreadId);
      const data = await sendMessageToOpenAI(currentThreadId, content.trim());
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== "typing-indicator"));
      
      // Store the current run ID
      if (data.runId) {
        setCurrentRunId(data.runId);
      }
      
      // 4. Insert assistant's response
      const assistantMessage = {
        client_id: userId,
        role: 'assistant' as const,
        content: data.message
      };
      
      console.log("Enregistrement de la réponse de l'assistant:", assistantMessage);
      const { data: assistantMessageData, error: assistantMessageError } = await supabase
        .from('messages')
        .insert([assistantMessage])
        .select();
        
      if (assistantMessageError) {
        console.error("Erreur lors de l'enregistrement de la réponse de l'assistant:", assistantMessageError);
        throw assistantMessageError;
      }
      
      // Add the assistant message to the UI immediately
      if (assistantMessageData && assistantMessageData.length > 0) {
        console.log("Réponse de l'assistant enregistrée avec succès:", assistantMessageData[0]);
        const newAssistantMessage: Message = {
          id: assistantMessageData[0].id,
          role: 'assistant',
          content: assistantMessageData[0].content,
          created_at: assistantMessageData[0].created_at
        };
        
        // If there are any tool calls, add them to the message
        if (data.toolCalls && data.toolCalls.length > 0) {
          newAssistantMessage.toolCalls = data.toolCalls;
          
          // Update the message in the database to include tool calls
          try {
            await updateMessageWithToolCalls(newAssistantMessage.id, data.toolCalls);
          } catch (error) {
            console.error("Error updating toolCalls in database:", error);
          }
        }
        
        setMessages(prev => [...prev.filter(msg => msg.id !== "typing-indicator"), newAssistantMessage]);
      }
      
      // 5. Handle tool calls if any
      if (data.toolCalls && data.toolCalls.length > 0) {
        console.log('Tool calls received:', data.toolCalls);
        
        // Process each tool call
        for (const toolCall of data.toolCalls) {
          if (toolCall.type === 'function' && currentThreadId && data.runId) {
            // Handle function calls, especially connect_gmail
            await handleFunctionCall(toolCall, currentThreadId, data.runId);
          }
        }
      }
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Impossible d'envoyer le message");
      
      // Remove typing indicator in case of error
      setMessages(prev => prev.filter(msg => msg.id !== "typing-indicator"));
    } finally {
      setSending(false);
    }
  };

  return {
    loading,
    sending,
    messages,
    sendMessage,
    userId,
    hasProfile,
    threadId,
    currentRunId
  };
};

export default useAssistantChat;
