import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { Message, AssistantState } from '@/types/assistant';
import { AssistantService } from '@/services/assistant/index';
import { useAuth } from '@/context/AuthContext';

const useAssistantChat = (existingAssistantService?: AssistantService): AssistantState => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const assistantServiceRef = useRef<AssistantService | null>(null);
  const initializationAttempted = useRef(false);

  // Initialize AssistantService
  const initializeAssistantService = useCallback(async () => {
    if (initializationAttempted.current || !user) return;
    initializationAttempted.current = true;

    try {
      if (existingAssistantService) {
        assistantServiceRef.current = existingAssistantService;
      } else {
        const conversationId = crypto.randomUUID();
        assistantServiceRef.current = new AssistantService(user.id, conversationId);
      }

      // Initialize with welcome message if no messages exist
      if (messages.length === 0) {
        const welcomeMessage = "Bienvenue ! Je suis votre assistant IA. Je peux vous aider à trouver et gérer vos leads. Par exemple, essayez de me demander : 'Trouve-moi des leads dans le secteur tech à Paris'.";
        const typedMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: welcomeMessage,
          client_id: user.id
        };
        setMessages([typedMessage]);
        assistantServiceRef.current.setMessages([typedMessage]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error initializing AssistantService:", error);
      toast.error("Une erreur est survenue lors de l'initialisation");
    }
  }, [existingAssistantService, messages.length, user]);

  useEffect(() => {
    if (user) {
      initializeAssistantService();
    }
  }, [user, initializeAssistantService]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !user || !assistantServiceRef.current) {
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
        client_id: user.id
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
        client_id: user.id
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
  }, [user]);

  return {
    loading,
    sending,
    isGenerating,
    messages,
    sendMessage,
    userId: user?.id || '',
  };
};

export default useAssistantChat;
