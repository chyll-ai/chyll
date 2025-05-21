
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import ChatMessage from '@/components/chat/ChatMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ClientProfile {
  id: string;
  client_id: string;
  company_name: string | null;
  industry: string | null;
}

const Assistant = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        if (messages.filter(msg => msg.role === 'assistant').length === 0) {
          const welcomeMessage = profileExists
            ? "Maintenant que votre profil est configuré, je peux vous aider à générer des emails..."
            : "Bienvenue ! Pour commencer, j'ai besoin de mieux comprendre votre cible et votre offre. On y va ?";
          
          await sendWelcomeMessage(userId, welcomeMessage);
        }
        
        // Create a new thread if needed
        if (!threadId) {
          const thread = await createThread();
          setThreadId(thread.threadId);
          localStorage.setItem('openai_thread_id', thread.threadId);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Une erreur s'est produite");
        setLoading(false);
      }
    };
    
    // Try to get existing threadId from localStorage
    const storedThreadId = localStorage.getItem('openai_thread_id');
    if (storedThreadId) {
      setThreadId(storedThreadId);
    }
    
    checkAuth();
    
    // Set up real-time subscription for new messages
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
                  created_at: newMessage.created_at
                };
                return [...current, typedMessage].sort((a, b) => 
                  new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                );
              });
            }
          }
        })
        .subscribe();
      
      return messagesChannel;
    };
    
    let messagesChannel: any;
    if (userId) {
      messagesChannel = setupSubscription(userId);
    }
    
    return () => {
      if (messagesChannel) {
        supabase.removeChannel(messagesChannel);
      }
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
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du message de bienvenue:", error);
    }
  };
  
  const createThread = async () => {
    try {
      // Fix for accessing protected properties: Use the full URL instead
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
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du thread');
      }
      
      return data;
    } catch (error) {
      console.error("Erreur lors de la création du thread:", error);
      toast.error("Impossible de créer une conversation avec l'assistant");
      throw error;
    }
  };
  
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || !userId || sending) return;
    
    try {
      setSending(true);
      
      // 1. Insert user message
      const userMessage = {
        client_id: userId,
        role: 'user' as const,
        content: inputMessage.trim()
      };
      
      const { error: userMessageError } = await supabase
        .from('messages')
        .insert([userMessage]);
        
      if (userMessageError) throw userMessageError;
      
      // Clear input immediately after sending
      const sentMessage = inputMessage.trim();
      setInputMessage('');
      
      // 2. Send to OpenAI Assistant API
      if (!threadId) {
        const thread = await createThread();
        setThreadId(thread.threadId);
        localStorage.setItem('openai_thread_id', thread.threadId);
      }
      
      // Show typing indicator
      const typingMessage = {
        id: "typing-indicator",
        role: 'assistant' as 'user' | 'assistant',
        content: "...",
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, typingMessage]);
      
      // Send message to OpenAI and get response
      // Fix for accessing protected properties: Use the full URL instead
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`
        },
        body: JSON.stringify({
          action: 'send_message',
          threadId: threadId,
          message: sentMessage
        })
      });
      
      const data = await response.json();
      
      // Remove typing indicator
      setMessages(prev => prev.filter(msg => msg.id !== "typing-indicator"));
      
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message');
      }
      
      // 3. Insert assistant's response
      const assistantMessage = {
        client_id: userId,
        role: 'assistant' as const,
        content: data.message
      };
      
      const { error: assistantMessageError } = await supabase
        .from('messages')
        .insert([assistantMessage]);
        
      if (assistantMessageError) throw assistantMessageError;
      
      // 4. Handle tool calls if any (just log for now as per requirements)
      if (data.toolCalls && data.toolCalls.length > 0) {
        console.log('Tool calls received:', data.toolCalls);
        // Here you would store or process the tool calls as needed
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
