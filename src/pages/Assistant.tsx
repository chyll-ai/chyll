
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import useAssistantChat from '@/hooks/assistant/useAssistantChat';
import { handleFunctionCall } from '@/lib/handleFunctionCall';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInputForm from '@/components/chat/ChatInputForm';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface AssistantProps {
  embedded?: boolean;
}

const Assistant = ({ embedded = false }: AssistantProps) => {
  const navigate = useNavigate();
  const [checkingProfile, setCheckingProfile] = useState(!embedded);
  
  const {
    loading,
    sending,
    messages,
    sendMessage,
    threadId,
    currentRunId,
    userId,
    hasProfile,
    conversationId
  } = useAssistantChat();
  
  // Handle OAuth redirect with authorization code
  useEffect(() => {
    const checkForOAuthCode = async () => {
      // Extract authorization code from URL if present
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      if (code && state) {
        try {
          console.log("OAuth code detected in URL, completing Gmail connection...");
          
          // Get user token for authentication
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            console.error("No active session found");
            toast.error("Vous devez être connecté pour finaliser la connexion Gmail");
            return;
          }
          
          const user_token = data.session.access_token;
          const client_id = data.session.user.id;
          
          // Exchange the code for tokens
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/connect-gmail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user_token}`
            },
            body: JSON.stringify({
              action: 'exchange_code',
              code,
              client_id,
              redirect_url: window.location.origin + window.location.pathname
            })
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error exchanging code for tokens:", errorData);
            toast.error("Erreur lors de la finalisation de la connexion Gmail");
            return;
          }
          
          const result = await response.json();
          console.log("Code exchange result:", result);
          
          if (result.status === "success") {
            toast.success("Connexion Gmail réussie!");
            
            // Add a delay before sending a message to the assistant
            setTimeout(() => {
              sendMessage("La connexion Gmail a été établie avec succès. Je peux maintenant vous aider à rédiger et envoyer des emails.");
            }, 2000);
          }
          
          // Clean up the URL to remove the code
          window.history.replaceState({}, document.title, window.location.pathname);
          
        } catch (error) {
          console.error("Error handling OAuth callback:", error);
          toast.error("Erreur lors de la finalisation de la connexion Gmail");
        }
      }
    };
    
    checkForOAuthCode();
  }, [sendMessage]);
  
  // Check if user profile exists and redirect to dashboard if needed
  useEffect(() => {
    // Skip this check if the component is embedded in another page
    if (embedded) {
      setCheckingProfile(false);
      return;
    }

    const checkUserProfile = async () => {
      try {
        // Get current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          console.error("No user found:", userError);
          navigate('/login');
          return;
        }

        // Check if user has a profile
        const { data: profileData, error: profileError } = await supabase
          .from('client_profile')
          .select('*')
          .eq('client_id', userData.user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error retrieving profile:", profileError);
          setCheckingProfile(false);
          return;
        }
        
        // If profile exists and not embedded, redirect to dashboard
        if (profileData && !embedded) {
          console.log("Profile found, redirecting to dashboard");
          navigate('/dashboard', { replace: true });
          return;
        }
        
        setCheckingProfile(false);
      } catch (error) {
        console.error("Error checking profile:", error);
        setCheckingProfile(false);
      }
    };
    
    checkUserProfile();
  }, [navigate, embedded]);
  
  // Handle any tool calls from the assistant
  const processToolCalls = useCallback((toolCalls) => {
    if (!toolCalls || !Array.isArray(toolCalls)) return;
    
    console.log("Processing tool calls:", toolCalls);
    
    toolCalls.forEach(toolCall => {
      if (toolCall.type === 'function' && threadId && currentRunId) {
        console.log(`Processing function call: ${toolCall.function?.name}`);
        handleFunctionCall(toolCall, threadId, currentRunId);
      }
    });
  }, [threadId, currentRunId]);
  
  if (checkingProfile || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col ${embedded ? 'h-full' : 'h-screen'} bg-background`}>
      <ChatHeader conversationId={conversationId} showBackButton={!embedded} />
      <ChatMessageList messages={messages} onProcessToolCalls={processToolCalls} />
      <ChatInputForm onSendMessage={sendMessage} disabled={sending} />
    </div>
  );
};

export default Assistant;
