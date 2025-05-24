import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { Message, AssistantState, Lead } from '@/types/assistant';
import { AssistantService } from '@/services/assistant';

// Helper function to convert database message to Message type
const convertToMessage = (dbMessage: any): Message => ({
  id: dbMessage.id,
  role: dbMessage.role,
  content: dbMessage.content,
  toolCalls: dbMessage.toolCalls || undefined,
  client_id: dbMessage.client_id,
  conversation_id: dbMessage.conversation_id,
  chat_session_id: dbMessage.chat_session_id
});

const useAssistantChat = (): AssistantState => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [assistantService, setAssistantService] = useState<AssistantService | null>(null);

  // Set up real-time subscription for leads
  useEffect(() => {
    if (!userId) return;

    // Subscribe to leads table changes
    const subscription = supabase
      .channel('leads-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `client_id=eq.${userId}`
        },
        (payload) => {
          console.log('New lead received:', payload);
          setLeads((currentLeads) => [...currentLeads, payload.new as Lead]);
          
          // Show a toast notification for each new lead
          toast.success(`New lead added: ${payload.new.full_name}`);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  // Load initial leads
  useEffect(() => {
    const loadLeads = async () => {
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('client_id', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading leads:', error);
          return;
        }

        setLeads(data as Lead[]);
      } catch (error) {
        console.error('Error in loadLeads:', error);
      }
    };

    loadLeads();
  }, [userId]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session?.user) {
          navigate('/login');
          return;
        }
        
        setUserId(session.user.id);
        
        // Check if user has a profile
        const { data: profile, error: profileError } = await supabase
          .from('client_profile')
          .select('is_complete')
          .eq('client_id', session.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error checking profile:", profileError);
        }
        
        setHasProfile(!!profile?.is_complete);
        
        // Get or create conversation
        const { data: conversation, error: conversationError } = await supabase
          .from('conversations')
          .select()
          .eq('client_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (conversationError) {
          console.error("Error fetching conversation:", conversationError);
          throw conversationError;
        }
        
        let currentConversation = conversation;
        
        if (!currentConversation) {
          const { data: newConversation, error: createError } = await supabase
            .from('conversations')
            .insert({
              client_id: session.user.id,
              type: 'chat'
            })
            .select()
            .single();
            
          if (createError) {
            console.error("Error creating conversation:", createError);
            throw createError;
          }
          
          currentConversation = newConversation;
        }
        
        setConversationId(currentConversation.id);
        
        // Initialize assistant service
        const assistant = new AssistantService(session.user.id, currentConversation.id);
        setAssistantService(assistant);
        
        // Fetch existing messages
        const { data: existingMessages, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', currentConversation.id)
          .order('id', { ascending: true });
          
        if (messagesError) {
          console.error("Error fetching messages:", messagesError);
          throw messagesError;
        }
        
        if (existingMessages) {
          const typedMessages = existingMessages.map(convertToMessage);
          setMessages(typedMessages);
          assistant.setMessages(typedMessages);
        }
        
        // Send welcome message if no messages exist
        if (!existingMessages?.length) {
          const welcomeMessage = profile?.is_complete
            ? "Parfait ! Votre profil est configuré. Commençons par générer une liste de prospects qualifiés pour votre business. Voulez-vous que je lance une recherche de leads correspondant à votre cible ?"
            : "Bienvenue ! Pour commencer, j'ai besoin de mieux comprendre votre cible et votre offre. On y va ?";
            
          const { data: welcomeMsg, error: welcomeError } = await supabase
            .from('messages')
            .insert({
              conversation_id: currentConversation.id,
              role: 'assistant',
              content: welcomeMessage,
              client_id: session.user.id
            })
            .select()
            .single();
            
          if (welcomeError) {
            console.error("Error saving welcome message:", welcomeError);
          } else if (welcomeMsg) {
            const typedMessage = convertToMessage(welcomeMsg);
            setMessages([typedMessage]);
            assistant.setMessages([typedMessage]);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error in checkAuth:", error);
        toast.error("Une erreur est survenue lors de l'initialisation");
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !userId || !conversationId || !assistantService) {
      console.error("Cannot send message: missing required data", {
        contentExists: !!content.trim(),
        userId,
        conversationId,
        assistantServiceExists: !!assistantService
      });
      return;
    }
    
    try {
      setSending(true);
      setIsGenerating(true);
      
      // Save user message to database first
      const { data: userMessage, error: userMessageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          client_id: userId,
          role: 'user',
          content: content.trim()
        })
        .select()
        .single();
        
      if (userMessageError) {
        throw userMessageError;
      }
      
      // Update UI with user message
      const typedUserMessage = convertToMessage(userMessage);
      setMessages(prev => [...prev, typedUserMessage]);

      // Get assistant's response
      const response = await assistantService.sendMessage(content);
      console.log("Assistant response:", response);
      
      // Save assistant message to database
      const { data: assistantMessage, error: assistantError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          client_id: userId,
          role: 'assistant',
          content: response.message,
          toolCalls: response.toolCalls
        })
        .select()
        .single();

      if (assistantError) {
        throw assistantError;
      }
      
      // Update UI with assistant message
      const typedAssistantMessage = convertToMessage(assistantMessage);
      setMessages(prev => [...prev, typedAssistantMessage]);
      
    } catch (error) {
      console.error("Error in sendMessage:", error);
      toast.error("Une erreur est survenue lors de l'envoi du message");
    } finally {
      setSending(false);
      setIsGenerating(false);
    }
  }, [userId, conversationId, assistantService]);

  return {
    loading,
    sending,
    isGenerating,
    messages,
    leads,
    sendMessage,
    userId: userId || '',
    hasProfile: !!hasProfile,
    conversationId: conversationId || '',
  };
};

export default useAssistantChat;
