import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { Message, AssistantState } from '@/types/assistant';
import { AssistantService } from '@/services/assistant';

const useAssistantChat = (existingAssistantService?: AssistantService): AssistantState => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const assistantServiceRef = useRef<AssistantService | null>(null);
  const initializationAttempted = useRef(false);

  // Initialize AssistantService
  const initializeAssistantService = useCallback(async () => {
    if (initializationAttempted.current) return;
    initializationAttempted.current = true;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        console.error("No session found during initialization");
        return;
      }

      if (existingAssistantService) {
        assistantServiceRef.current = existingAssistantService;
      } else {
        console.log('Initializing new AssistantService');
        const conversationId = crypto.randomUUID();
        assistantServiceRef.current = new AssistantService(session.user.id, conversationId);
      }

      // Initialize with welcome message if no messages exist
      if (messages.length === 0) {
        const welcomeMessage = "Bienvenue ! Je suis votre assistant IA. Je peux vous aider à trouver et gérer vos leads. Par exemple, essayez de me demander : 'Trouve-moi des leads dans le secteur tech à Paris'.";
        const typedMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: welcomeMessage,
          client_id: session.user.id
        };
        setMessages([typedMessage]);
        assistantServiceRef.current.setMessages([typedMessage]);
      }
    } catch (error) {
      console.error("Error initializing AssistantService:", error);
      toast.error("Une erreur est survenue lors de l'initialisation");
    }
  }, [existingAssistantService, messages.length]);

  useEffect(() => {
    let mounted = true;
    
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }
        
        if (!session?.user || !mounted) {
          console.log("No valid session found");
          navigate('/login');
          return;
        }
        
        setUserId(session.user.id);
        await initializeAssistantService();
        setLoading(false);
      } catch (error) {
        if (mounted) {
          console.error("Error in checkAuth:", error);
          toast.error("Une erreur est survenue lors de l'initialisation");
          navigate('/login');
        }
      }
    };
    
    checkAuth();
    
    return () => {
      mounted = false;
    };
  }, [navigate, initializeAssistantService]);

  const sendMessage = useCallback(async (content: string) => {
    // Ensure AssistantService is initialized
    if (!assistantServiceRef.current) {
      await initializeAssistantService();
    }

    if (!content.trim() || !userId || !assistantServiceRef.current) {
      console.error("Cannot send message: missing required data", {
        contentExists: !!content.trim(),
        userId,
        assistantServiceExists: !!assistantServiceRef.current
      });
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      return;
    }
    
    try {
      setSending(true);
      setIsGenerating(true);
      
      // Add user message to state
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: content.trim(),
        client_id: userId
      };
      
      setMessages(prev => {
        const newMessages = [...prev, userMessage];
        assistantServiceRef.current?.setMessages(newMessages);
        return newMessages;
      });
      
      // Get assistant's response
      const response = await assistantServiceRef.current.sendMessage(content);
      
      // Add assistant message to state
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message,
        client_id: userId
      };
      
      setMessages(prev => {
        const newMessages = [...prev, assistantMessage];
        assistantServiceRef.current?.setMessages(newMessages);
        return newMessages;
      });
      
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setSending(false);
      setIsGenerating(false);
    }
  }, [userId, initializeAssistantService]);

  return {
    loading,
    sending,
    isGenerating,
    messages,
    sendMessage,
    userId: userId || '',
  };
};

export default useAssistantChat;
