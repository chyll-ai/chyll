
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
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

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Erreur lors de la vérification de l'utilisateur:", userError);
          throw new Error(userError.message);
        }
        
        if (!userData.user) {
          console.log("Pas d'utilisateur trouvé, redirection vers login");
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
        
        setHasProfile(!!profileData);
        setAuthChecked(true);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Une erreur s'est produite lors de la vérification de l'authentification");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Load messages and create thread once user is authenticated
  useEffect(() => {
    if (!userId || !authChecked) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch chat messages
        await fetchMessages(userId);
        
        // Create a new thread or use existing one
        await setupThread();
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Une erreur s'est produite lors du chargement");
        setLoading(false);
      }
    };
    
    loadData();
  }, [userId, authChecked]);

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

  const setupSubscription = (userId: string) => {
    console.log("Configuration de l'abonnement aux messages en temps réel pour l'utilisateur:", userId);
    
    const messagesChannel = supabase
      .channel('public:messages')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `client_id=eq.${userId}`
      }, (payload) => {
        console.log("Changement détecté dans les messages:", payload);
        
        if (payload.new && typeof payload.new === 'object') {
          const newMessage = payload.new as any;
          if (newMessage.role === 'user' || newMessage.role === 'assistant') {
            setMessages(current => {
              // Check if the message already exists
              if (current.some(msg => msg.id === newMessage.id)) {
                console.log("Message déjà présent dans l'état", newMessage.id);
                return current;
              }
              
              console.log("Ajout du nouveau message à l'état:", newMessage);
              // Cast role to 'user' | 'assistant' type
              const role = newMessage.role as 'user' | 'assistant';
              const typedMessage: Message = {
                id: newMessage.id,
                role: role,
                content: newMessage.content,
                created_at: newMessage.created_at
              };
              
              return [...current, typedMessage].sort((a, b) => 
                new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
              );
            });
          }
        }
      })
      .subscribe((status) => {
        console.log("Status de souscription aux messages:", status);
      });
    
    return messagesChannel;
  };
  
  const fetchMessages = async (userId: string) => {
    try {
      console.log("Récupération des messages pour l'utilisateur:", userId);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error("Erreur lors de la récupération des messages:", error);
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
          created_at: msg.created_at
        };
      }) || [];
      
      setMessages(typedMessages);
      console.log(`Récupération de ${typedMessages.length} messages:`, typedMessages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
      toast.error("Impossible de charger les messages");
    }
  };

  const setupThread = async () => {
    // Try to get existing threadId from localStorage
    const storedThreadId = localStorage.getItem('openai_thread_id');
    
    if (storedThreadId) {
      console.log("Utilisation du thread existant:", storedThreadId);
      setThreadId(storedThreadId);
      return;
    }
    
    try {
      console.log("Création d'un nouveau thread...");
      const thread = await createThread();
      console.log("Thread créé:", thread);
      
      if (thread.threadId) {
        setThreadId(thread.threadId);
        localStorage.setItem('openai_thread_id', thread.threadId);
      } else {
        throw new Error("Impossible de créer un thread: réponse invalide");
      }
    } catch (error) {
      console.error("Erreur lors de la création du thread:", error);
      toast.error("Impossible de créer une conversation avec l'assistant");
    }
  };
  
  const sendWelcomeMessage = async (userId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          client_id: userId,
          role: 'assistant',
          content: content
        }])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Add the welcome message to the local state
        const welcomeMsg: Message = {
          id: data[0].id,
          role: 'assistant',
          content: content,
          created_at: data[0].created_at
        };
        setMessages(prev => [...prev, welcomeMsg]);
      }
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du message de bienvenue:", error);
    }
  };
  
  const createThread = async () => {
    try {
      console.log("Appel de la fonction Edge pour créer un thread...");
      
      // Use the full URL for the Edge Function
      const baseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co';
      const response = await fetch(`${baseUrl}/functions/v1/openai-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`
        },
        body: JSON.stringify({
          action: 'create_thread'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur de réponse lors de la création du thread:", errorData);
        throw new Error(errorData.error || 'Erreur lors de la création du thread');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la création du thread:", error);
      throw error;
    }
  };
  
  const sendMessage = async (content: string) => {
    if (!content.trim() || !userId) {
      console.log("Message vide ou utilisateur non connecté");
      return;
    }
    
    if (sending) {
      console.log("Envoi déjà en cours, veuillez patienter");
      toast.error("Un message est déjà en cours d'envoi, veuillez patienter");
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
      
      // 1. Insert user message into the database
      console.log("Envoi du message utilisateur à Supabase:", content.trim());
      const { data: userMessageData, error: userMessageError } = await supabase
        .from('messages')
        .insert([{
          client_id: userId,
          role: 'user' as const,
          content: content.trim()
        }])
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
          if (!thread || !thread.threadId) {
            throw new Error("Réponse invalide lors de la création du thread");
          }
          
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
      
      const baseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co';
      const response = await fetch(`${baseUrl}/functions/v1/openai-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`
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
        console.error("Erreur de réponse de l'API OpenAI:", errorData);
        toast.error("Erreur de communication avec l'assistant");
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
      }
      
      const data = await response.json();
      console.log("Réponse reçue de l'API OpenAI:", data);
      
      if (!data.message) {
        console.error("Format de réponse invalide de l'API OpenAI:", data);
        toast.error("Réponse invalide de l'assistant");
        throw new Error('Format de réponse invalide');
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
        toast.error("Erreur lors de l'enregistrement de la réponse");
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
        
        setMessages(prev => [...prev.filter(msg => msg.id !== "typing-indicator"), newAssistantMessage]);
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
  };
};

export default useAssistantChat;
