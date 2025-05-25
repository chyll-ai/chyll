import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { Message, AssistantState } from '@/types/assistant';
import { AssistantService } from '@/services/assistant';

const useAssistantChat = (): AssistantState => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [assistantService, setAssistantService] = useState<AssistantService | null>(null);

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
        
        // Try to create client first
        const { error: insertError } = await supabase
          .from('clients')
          .upsert({
            id: session.user.id,
            email: session.user.email
          }, {
            onConflict: 'id',
            ignoreDuplicates: true
          });

        if (insertError && insertError.code !== '23505') { // Ignore duplicate key errors
          console.error("Error creating client:", insertError);
          throw insertError;
        }
        
        if (mounted) {
          // Initialize assistant service
          const assistant = new AssistantService(session.user.id);
          setAssistantService(assistant);
          
          // Send welcome message if no messages exist
          if (!messages.length) {
            const welcomeMessage = "Bienvenue ! Je suis votre assistant IA. Comment puis-je vous aider aujourd'hui ?";
            const typedMessage: Message = {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: welcomeMessage,
              client_id: session.user.id
            };
            setMessages([typedMessage]);
            assistant.setMessages([typedMessage]);
          }
          
          setLoading(false);
        }
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
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !userId || !assistantService) {
      console.error("Cannot send message: missing required data", {
        contentExists: !!content.trim(),
        userId,
        assistantServiceExists: !!assistantService
      });
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
      
      setMessages(prev => [...prev, userMessage]);
      
      // Get assistant's response
      const response = await assistantService.sendMessage(content);
      
      // Add assistant message to state
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.message,
        client_id: userId
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setSending(false);
      setIsGenerating(false);
    }
  }, [userId, assistantService]);

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
