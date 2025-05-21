import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  toolCalls?: any[];
}

// Define the shape of messages as they come from the database
interface DatabaseMessage {
  id: string;
  role: string;
  content: string;
  created_at: string;
  client_id: string;
  chat_session_id?: string;
  toolCalls?: any; // Database field might exist but not be typed properly
}

export interface ClientProfile {
  id: string;
  client_id: string;
  company_name: string | null;
  industry: string | null;
}

export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

// Function to handle tool calls, specifically for connect_gmail
async function handleFunctionCall(toolCall: ToolCall, threadId: string, runId: string) {
  if (toolCall.function.name === 'connect_gmail') {
    try {
      console.log("Processing connect_gmail function call");
      // Get the user's session to extract the access token
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        console.error("No active session found");
        toast.error("Vous devez être connecté pour utiliser cette fonctionnalité");
        return;
      }
      
      const user_token = data.session.access_token;
      
      // Make the request to the connect-gmail edge function
      // Fix the authorization header issue by ensuring it's properly set
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/connect-gmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user_token}`
        },
        body: JSON.stringify({
          thread_id: threadId,
          run_id: runId,
          user_token: user_token,
          tool_call_id: toolCall.id
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error connecting to Gmail:", errorData);
        toast.error("Erreur lors de la connexion à Gmail");
        return;
      }
      
      // Log the result but don't show anything in the UI
      const result = await response.json();
      console.log("Gmail connection initiated:", result);
      
      if (result.oauth_url) {
        console.log("OAuth URL generated:", result.oauth_url);
        // Open the OAuth URL in a new tab
        window.open(result.oauth_url, '_blank');
        toast.success("Redirection vers la page de connexion Gmail...");
      }
      
      // We don't display anything in the UI as the assistant will handle the response
    } catch (error) {
      console.error("Error initiating Gmail connection:", error);
      toast.error("Erreur lors de la connexion à Gmail");
    }
  } else {
    console.log(`Function call detected but not handled: ${toolCall.function.name}`);
  }
}

export const useAssistantChat = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);

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
        await fetchMessages(userId);
        
        // Check if any assistant messages exist, and if not, send a welcome message
        const assistantMessages = messages.filter(msg => msg.role === 'assistant');
        if (assistantMessages.length === 0) {
          console.log("Aucun message assistant trouvé, envoi d'un message de bienvenue...");
          const welcomeMessage = profileExists
            ? "Maintenant que votre profil est configuré, je peux vous aider à générer des emails..."
            : "Bienvenue ! Pour commencer, j'ai besoin de mieux comprendre votre cible et votre offre. On y va ?";
          
          await sendWelcomeMessage(userId, welcomeMessage);
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
      
      // Type cast the data to ensure role is either 'user' or 'assistant'
      const typedMessages: Message[] = data?.map(msg => {
        // Explicitly type the database message
        const dbMessage = msg as DatabaseMessage;
        
        // Ensure role is one of the allowed values
        const role = (dbMessage.role === 'user' || dbMessage.role === 'assistant') 
          ? dbMessage.role as 'user' | 'assistant'
          : 'assistant'; // Default fallback
          
        // Create a properly typed Message object
        const message: Message = {
          id: dbMessage.id,
          role: role,
          content: dbMessage.content,
          created_at: dbMessage.created_at
        };
        
        // Only add toolCalls if they exist in the database message
        if (dbMessage.toolCalls) {
          message.toolCalls = Array.isArray(dbMessage.toolCalls) ? dbMessage.toolCalls : [];
        }
        
        return message;
      }) || [];
      
      setMessages(typedMessages);
      console.log(`Fetched ${typedMessages.length} messages:`, typedMessages);
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error);
      toast.error("Impossible de charger les messages");
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
          // Note: No toolCalls for welcome message
        };
        setMessages(prev => [...prev, welcomeMsg]);
      }
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du message de bienvenue:", error);
    }
  };
  
  const createThread = async () => {
    try {
      // Use the full URL for the Edge Function
      // Fix the authorization header issue by ensuring it's properly set
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
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
        throw new Error(errorData.error || 'Erreur lors de la création du thread');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la création du thread:", error);
      toast.error("Impossible de créer une conversation avec l'assistant");
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
      // Fix the authorization header issue by ensuring it's properly set
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
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
        throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
      }
      
      const data = await response.json();
      console.log("Réponse reçue de l'API OpenAI:", data);
      
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
          // Use a custom RPC function that handles the updating of the toolCalls JSON field
          // Fix the type error by properly casting the tool_calls parameter
          const { error: updateError } = await supabase
            .rpc('update_message_toolcalls', { 
              message_id: newAssistantMessage.id, 
              tool_calls: JSON.stringify(data.toolCalls) 
            } as {
              message_id: string;
              tool_calls: string;
            });
            
          if (updateError) {
            console.error("Error updating message with tool calls:", updateError);
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
    handleFunctionCall,
    threadId,
    currentRunId
  };
};

export { handleFunctionCall };
export default useAssistantChat;
