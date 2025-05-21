
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  chat_session_id?: string | null;
}

export interface ClientProfile {
  id: string;
  client_id: string;
  company_name: string | null;
  industry: string | null;
}

export const useAssistantChat = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      try {
        console.log("useAssistantChat: Vérification de la session");
        // Get current user
        const { data: authData, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          console.error("useAssistantChat: Erreur lors de la vérification de la session:", authError);
          if (isMounted) {
            setApiError(`Erreur d'authentification: ${authError.message}`);
          }
          return;
        }
        
        if (!authData.session) {
          console.log("useAssistantChat: Pas de session active trouvée");
          if (isMounted) {
            setApiError("Aucune session active. Veuillez vous connecter.");
          }
          return;
        }
        
        const userId = authData.session.user.id;
        console.log("useAssistantChat: Session utilisateur trouvée, ID:", userId);
        if (isMounted) {
          setUserId(userId);
        }
        
        // Create client record if it doesn't exist
        try {
          const { data: client, error: clientError } = await supabase
            .from('clients')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
            
          if (clientError) {
            console.error("useAssistantChat: Erreur lors de la vérification du client:", clientError);
            throw new Error("Erreur lors de la vérification du client");
          }
          
          if (!client) {
            console.log("useAssistantChat: Client non trouvé, création en cours...");
            await supabase
              .from('clients')
              .insert({
                id: userId,
                email: authData.session.user.email || ''
              });
            console.log("useAssistantChat: Client créé avec succès");
          }
          
          // Check if user has a profile
          const { data: profileData, error: profileError } = await supabase
            .from('client_profile')
            .select('*')
            .eq('client_id', userId)
            .maybeSingle();
            
          if (profileError) {
            console.error("useAssistantChat: Erreur lors de la récupération du profil:", profileError);
            throw new Error("Erreur lors de la récupération du profil");
          }
          
          if (isMounted) {
            setHasProfile(!!profileData);
            setAuthChecked(true);
          }
        } catch (dataError) {
          console.error("useAssistantChat: Erreur lors du traitement des données:", dataError);
          if (isMounted) {
            setApiError("Erreur lors du chargement des données utilisateur");
          }
        }
      } catch (error) {
        console.error("useAssistantChat: Erreur lors du chargement des données:", error);
        if (isMounted) {
          setApiError("Une erreur s'est produite lors de la vérification de l'authentification");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("useAssistantChat: Changement d'état d'authentification:", event);
        if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUserId(null);
          }
        } else if (event === 'SIGNED_IN' && session) {
          if (isMounted) {
            setUserId(session.user.id);
            setApiError(null); // Clear any auth errors on successful sign in
          }
        }
      }
    );
    
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Function to create a new chat session
  const createChatSession = useCallback(async () => {
    if (!userId) {
      console.error("useAssistantChat: Impossible de créer une session sans utilisateur");
      return null;
    }
    
    try {
      console.log("useAssistantChat: Création d'une nouvelle session de chat");
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          client_id: userId,
          title: null // Le titre sera mis à jour ultérieurement
        }])
        .select();
      
      if (error) {
        console.error("useAssistantChat: Erreur lors de la création de la session:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log("useAssistantChat: Nouvelle session créée:", data[0]);
        setCurrentSessionId(data[0].id);
        setApiError(null); // Clear any previous errors
        return data[0].id;
      }
      
      console.error("useAssistantChat: Aucune session créée, réponse vide");
      return null;
    } catch (error) {
      console.error("useAssistantChat: Erreur lors de la création de la session:", error);
      toast.error("Impossible de créer une nouvelle session de chat");
      setApiError("Erreur de création de session");
      return null;
    }
  }, [userId]);

  // Load messages for a specific chat session
  const fetchMessages = useCallback(async (chatSessionId: string | null) => {
    if (!userId || !chatSessionId) {
      console.log("useAssistantChat: Pas d'utilisateur ou de session pour charger les messages");
      setMessages([]);
      return;
    }
    
    try {
      console.log(`useAssistantChat: Récupération des messages pour la session: ${chatSessionId}`);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', userId)
        .eq('chat_session_id', chatSessionId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error("useAssistantChat: Erreur lors de la récupération des messages:", error);
        setApiError("Erreur de chargement des messages");
        throw error;
      }
      
      // Type cast the data to ensure role is either 'user' or 'assistant'
      const typedMessages: Message[] = data?.map(msg => {
        // Ensure role is one of the allowed values
        const role = (msg.role === 'user' || msg.role === 'assistant') 
          ? msg.role as 'user' | 'assistant'
          : 'assistant'; // Default fallback
          
        return {
          id: msg.id,
          role: role,
          content: msg.content,
          created_at: msg.created_at,
          chat_session_id: msg.chat_session_id
        };
      }) || [];
      
      setMessages(typedMessages);
      console.log(`useAssistantChat: Récupération de ${typedMessages.length} messages pour la session`);
      
      // Clear errors if successful
      setApiError(null);
    } catch (error) {
      console.error("useAssistantChat: Erreur lors de la récupération des messages:", error);
      toast.error("Impossible de charger les messages");
    }
  }, [userId]);

  // Update the thread ID when the chat session changes
  useEffect(() => {
    if (currentSessionId) {
      console.log("useAssistantChat: Session courante modifiée:", currentSessionId);
      fetchMessages(currentSessionId);
      
      // Stocker la session courante dans localStorage
      localStorage.setItem('current_chat_session_id', currentSessionId);
      
      // Mettre à jour le threadId pour cette session
      const storedThreadId = localStorage.getItem(`openai_thread_id_${currentSessionId}`);
      if (storedThreadId) {
        console.log("useAssistantChat: Utilisation du thread existant pour cette session:", storedThreadId);
        setThreadId(storedThreadId);
      } else {
        // Créer un nouveau thread pour cette session
        console.log("useAssistantChat: Création d'un nouveau thread pour la session");
        setupThread(currentSessionId);
      }
    } else {
      // Réinitialiser les messages si aucune session n'est sélectionnée
      console.log("useAssistantChat: Pas de session sélectionnée, réinitialisation des messages");
      setMessages([]);
      setThreadId(null);
    }
  }, [currentSessionId, fetchMessages]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    let messagesChannel: any;
    
    if (userId) {
      // Si une session spécifique est sélectionnée, ne suivre que les messages de cette session
      if (currentSessionId) {
        console.log("useAssistantChat: Configuration de l'abonnement aux messages pour la session:", currentSessionId);
        messagesChannel = setupSubscription(userId, currentSessionId);
      }
    }
    
    return () => {
      if (messagesChannel) {
        console.log("useAssistantChat: Nettoyage de l'abonnement aux messages");
        supabase.removeChannel(messagesChannel);
      }
    };
  }, [userId, currentSessionId]);

  const setupSubscription = (userId: string, sessionId: string | null) => {
    console.log(`useAssistantChat: Configuration de l'abonnement aux messages pour la session: ${sessionId}`);
    
    let filter = { client_id: `eq.${userId}` };
    if (sessionId) {
      // @ts-ignore - Le typage de Supabase ne gère pas bien les filtres multiples
      filter.chat_session_id = `eq.${sessionId}`;
    }
    
    const messagesChannel = supabase
      .channel('public:messages:' + (sessionId || 'all'))
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `client_id=eq.${userId}${sessionId ? ` AND chat_session_id=eq.${sessionId}` : ''}`
      }, (payload) => {
        console.log("useAssistantChat: Changement détecté dans les messages:", payload);
        
        if (payload.new && typeof payload.new === 'object') {
          const newMessage = payload.new as any;
          
          // Ne traiter que les messages de la session courante
          if (sessionId && newMessage.chat_session_id !== sessionId) {
            console.log("useAssistantChat: Message ignoré - session différente:", newMessage.chat_session_id);
            return;
          }
          
          if (newMessage.role === 'user' || newMessage.role === 'assistant') {
            setMessages(current => {
              // Check if the message already exists
              if (current.some(msg => msg.id === newMessage.id)) {
                console.log("useAssistantChat: Message déjà présent dans l'état", newMessage.id);
                return current;
              }
              
              console.log("useAssistantChat: Ajout du nouveau message à l'état:", newMessage);
              // Cast role to 'user' | 'assistant' type
              const role = newMessage.role as 'user' | 'assistant';
              const typedMessage: Message = {
                id: newMessage.id,
                role: role,
                content: newMessage.content,
                created_at: newMessage.created_at,
                chat_session_id: newMessage.chat_session_id
              };
              
              return [...current, typedMessage].sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
            });
          }
        }
      })
      .subscribe((status) => {
        console.log("useAssistantChat: Status de souscription aux messages:", status);
      });
    
    return messagesChannel;
  };

  const setupThread = async (sessionId: string | null = null) => {
    if (!sessionId) {
      console.log("useAssistantChat: Pas de session spécifiée pour créer un thread");
      return;
    }
    
    // Try to get existing threadId from localStorage for this session
    const storedThreadId = localStorage.getItem(`openai_thread_id_${sessionId}`);
    
    if (storedThreadId) {
      console.log(`useAssistantChat: Utilisation du thread existant pour la session ${sessionId}:`, storedThreadId);
      setThreadId(storedThreadId);
      return;
    }
    
    try {
      console.log("useAssistantChat: Création d'un nouveau thread pour la session:", sessionId);
      const thread = await createThread();
      console.log("useAssistantChat: Thread créé:", thread);
      
      if (thread.threadId) {
        setThreadId(thread.threadId);
        localStorage.setItem(`openai_thread_id_${sessionId}`, thread.threadId);
      } else {
        throw new Error("Impossible de créer un thread: réponse invalide");
      }
    } catch (error) {
      console.error("useAssistantChat: Erreur lors de la création du thread:", error);
      setApiError("Impossible de créer un nouveau thread OpenAI");
      toast.error("Impossible de créer une conversation avec l'assistant");
    }
  };
  
  const createThread = async () => {
    try {
      console.log("useAssistantChat: Appel de la fonction Edge pour créer un thread...");
      
      // Use the full URL for the Edge Function
      const baseUrl = 'https://atsfuqwxfrezkxtnctmk.supabase.co';
      const response = await fetch(`${baseUrl}/functions/v1/openai-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE`
        },
        body: JSON.stringify({
          action: 'create_thread'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("useAssistantChat: Erreur de réponse lors de la création du thread:", errorData);
        throw new Error(errorData.error || 'Erreur lors de la création du thread');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("useAssistantChat: Erreur lors de la création du thread:", error);
      throw error;
    }
  };
  
  const sendMessage = async (content: string) => {
    if (!content.trim() || !userId || !currentSessionId) {
      console.log("useAssistantChat: Message vide, utilisateur non connecté ou session non définie");
      if (!currentSessionId) {
        toast.error("Aucune session active sélectionnée");
      }
      return;
    }
    
    if (sending) {
      console.log("useAssistantChat: Envoi déjà en cours, veuillez patienter");
      toast.error("Un message est déjà en cours d'envoi, veuillez patienter");
      return;
    }
    
    try {
      setSending(true);
      setApiError(null); // Clear any previous errors
      
      // Create a temporary message to display immediately in the UI
      const tempUserMessage: Message = {
        id: "temp-" + Date.now(),
        role: 'user',
        content: content.trim(),
        created_at: new Date().toISOString(),
        chat_session_id: currentSessionId
      };
      
      // Update the UI immediately with the user message
      setMessages(prev => [...prev, tempUserMessage]);
      
      // 1. Insert user message into the database
      console.log("useAssistantChat: Envoi du message utilisateur à Supabase:", content.trim());
      const { data: userMessageData, error: userMessageError } = await supabase
        .from('messages')
        .insert([{
          client_id: userId,
          role: 'user' as const,
          content: content.trim(),
          chat_session_id: currentSessionId
        }])
        .select();
        
      if (userMessageError) {
        console.error("useAssistantChat: Erreur lors de l'insertion du message utilisateur:", userMessageError);
        setApiError(`Erreur d'envoi de message: ${userMessageError.message}`);
        throw userMessageError;
      }
      
      // Replace the temporary message with the actual one from the database
      if (userMessageData && userMessageData.length > 0) {
        console.log("useAssistantChat: Message utilisateur enregistré avec succès:", userMessageData[0]);
        setMessages(prev => prev.map(msg => 
          msg.id === tempUserMessage.id ? {
            id: userMessageData[0].id,
            role: 'user',
            content: userMessageData[0].content,
            created_at: userMessageData[0].created_at,
            chat_session_id: userMessageData[0].chat_session_id
          } : msg
        ));
        
        // Mettre à jour le titre de la session si c'est le premier message
        updateSessionTitle(currentSessionId, content.trim());
      } else {
        console.error("useAssistantChat: Aucune donnée reçue après l'insertion du message utilisateur");
      }
      
      // 2. Verify or create thread if needed
      let currentThreadId = threadId;
      if (!currentThreadId) {
        console.log("useAssistantChat: Pas de thread existant, création d'un nouveau thread...");
        try {
          const thread = await createThread();
          if (!thread || !thread.threadId) {
            throw new Error("Réponse invalide lors de la création du thread");
          }
          
          currentThreadId = thread.threadId;
          setThreadId(currentThreadId);
          if (currentSessionId) {
            localStorage.setItem(`openai_thread_id_${currentSessionId}`, currentThreadId);
          }
          console.log("useAssistantChat: Nouveau thread créé:", currentThreadId);
        } catch (threadError) {
          console.error("useAssistantChat: Erreur lors de la création du thread:", threadError);
          setApiError("Erreur de communication avec l'assistant OpenAI");
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
        created_at: new Date().toISOString(),
        chat_session_id: currentSessionId
      };
      
      setMessages(prev => [...prev, typingMessage]);
      
      // 3. Send message to OpenAI and get response
      console.log("useAssistantChat: Envoi du message à OpenAI avec threadId:", currentThreadId);
      
      const baseUrl = 'https://atsfuqwxfrezkxtnctmk.supabase.co';
      const response = await fetch(`${baseUrl}/functions/v1/openai-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE`
        },
        body: JSON.stringify({
          action: 'send_message',
          threadId: currentThreadId,
          message: content.trim()
        })
      });
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== "typing-indicator"));
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("useAssistantChat: Erreur de réponse de l'API OpenAI:", errorData);
        setApiError(`Erreur API OpenAI: ${errorData.error || 'Inconnue'}`);
        toast.error("Erreur de communication avec l'assistant");
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
      }
      
      const data = await response.json();
      console.log("useAssistantChat: Réponse reçue de l'API OpenAI:", data);
      
      if (!data.message) {
        console.error("useAssistantChat: Format de réponse invalide de l'API OpenAI:", data);
        setApiError("Réponse invalide de l'API OpenAI");
        toast.error("Réponse invalide de l'assistant");
        throw new Error('Format de réponse invalide');
      }
      
      // 4. Insert assistant's response
      const assistantMessage = {
        client_id: userId,
        role: 'assistant' as const,
        content: data.message,
        chat_session_id: currentSessionId
      };
      
      console.log("useAssistantChat: Enregistrement de la réponse de l'assistant:", assistantMessage);
      const { data: assistantMessageData, error: assistantMessageError } = await supabase
        .from('messages')
        .insert([assistantMessage])
        .select();
        
      if (assistantMessageError) {
        console.error("useAssistantChat: Erreur lors de l'enregistrement de la réponse de l'assistant:", assistantMessageError);
        setApiError("Erreur d'enregistrement de la réponse");
        toast.error("Erreur lors de l'enregistrement de la réponse");
        throw assistantMessageError;
      }
      
      // Add the assistant message to the UI immediately
      if (assistantMessageData && assistantMessageData.length > 0) {
        console.log("useAssistantChat: Réponse de l'assistant enregistrée avec succès:", assistantMessageData[0]);
        const newAssistantMessage: Message = {
          id: assistantMessageData[0].id,
          role: 'assistant',
          content: assistantMessageData[0].content,
          created_at: assistantMessageData[0].created_at,
          chat_session_id: assistantMessageData[0].chat_session_id
        };
        
        setMessages(prev => [...prev.filter(msg => msg.id !== "typing-indicator"), newAssistantMessage]);
      }
      
    } catch (error) {
      console.error("useAssistantChat: Erreur lors de l'envoi du message:", error);
      toast.error("Impossible d'envoyer le message");
      
      // Remove typing indicator in case of error
      setMessages(prev => prev.filter(msg => msg.id !== "typing-indicator"));
      
      if (!apiError) {
        setApiError(`Erreur de communication: ${error instanceof Error ? error.message : 'Inconnue'}`);
      }
    } finally {
      setSending(false);
    }
  };

  // Mettre à jour le titre de la session
  const updateSessionTitle = useCallback(async (sessionId: string, firstMessage: string) => {
    if (!userId || !sessionId) return;
    
    try {
      // Vérifier si la session a déjà un titre
      const { data: sessionData } = await supabase
        .from('chat_sessions')
        .select('title')
        .eq('id', sessionId)
        .single();
      
      // Ne mettre à jour que si le titre est null
      if (sessionData && sessionData.title === null) {
        // Générer un titre basé sur le premier message (limité à 50 caractères)
        const title = firstMessage.length > 50 
          ? firstMessage.substring(0, 47) + '...' 
          : firstMessage;
        
        const { error } = await supabase
          .from('chat_sessions')
          .update({ title })
          .eq('id', sessionId);
        
        if (error) {
          console.error("useAssistantChat: Erreur lors de la mise à jour du titre de la session:", error);
        } else {
          console.log("useAssistantChat: Titre de la session mis à jour:", title);
        }
      }
    } catch (error) {
      console.error("useAssistantChat: Erreur lors de la mise à jour du titre de la session:", error);
      // Ne pas afficher de toast pour éviter de perturber l'utilisateur
    }
  }, [userId]);

  return {
    loading,
    sending,
    messages,
    sendMessage,
    userId,
    hasProfile,
    currentSessionId,
    setCurrentSessionId,
    createChatSession,
    fetchMessages,
    apiError,
  };
};

export default useAssistantChat;
