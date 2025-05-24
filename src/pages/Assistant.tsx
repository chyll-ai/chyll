import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAssistantChat from '@/hooks/assistant/useAssistantChat';
import { handleFunctionCall } from '@/lib/handleFunctionCall';
import { useOAuthHandler } from '@/hooks/assistant/useOAuthHandler';
import { useProfileCheck } from '@/hooks/assistant/useProfileCheck';
import { useProfile } from '@/context/ProfileContext';
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
  const [redirecting, setRedirecting] = useState(false);
  const [processedToolCalls] = useState<Set<string>>(new Set());
  
  const { profile, isComplete } = useProfile();
  const { loading, sending, messages, sendMessage, threadId, currentRunId, conversationId } = useAssistantChat();
  
  // Handle OAuth flow
  const { oauthInProgress } = useOAuthHandler({
    onSuccess: () => {
      setTimeout(() => {
        sendMessage("La connexion Gmail a été établie avec succès. Je peux maintenant vous aider à rédiger et envoyer des emails.");
      }, 2000);
    }
  });

  // Handle profile checking
  const { checkingProfile } = useProfileCheck({ 
    embedded,
    onComplete: () => {
      if (!embedded) {
        setRedirecting(true);
        toast.success("Votre profil est complet ! Redirection vers le tableau de bord...");
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    }
  });
  
  // Handle tool calls from the assistant
  const processToolCalls = useCallback((toolCalls) => {
    if (!toolCalls?.length) return;
    
    toolCalls.forEach(toolCall => {
      if (processedToolCalls.has(toolCall.id) || toolCall.type !== 'function') return;
      
      if (toolCall.function?.name === 'redirect_to_dashboard' && !redirecting) {
        setRedirecting(true);
        toast.success("Votre profil est complet ! Redirection vers le tableau de bord...");
        setTimeout(() => navigate('/dashboard'), 1500);
      } else if (threadId && currentRunId) {
        handleFunctionCall(toolCall, threadId, currentRunId, { profile, isComplete });
      }
      
      processedToolCalls.add(toolCall.id);
    });
  }, [threadId, currentRunId, processedToolCalls, navigate, redirecting, profile, isComplete]);

  if (checkingProfile || loading) {
    return <LoadingScreen />;
  }
  
  if (redirecting) {
    return <LoadingScreen message="Redirection en cours..." />;
  }
  
  return (
    <div className={`flex flex-col ${embedded ? 'h-full' : 'h-screen'} bg-background`}>
      <ChatHeader conversationId={conversationId} showBackButton={!embedded} />
      <ChatMessageList messages={messages} onProcessToolCalls={processToolCalls} />
      <ChatInputForm onSendMessage={sendMessage} disabled={sending || oauthInProgress || redirecting} />
    </div>
  );
};

const LoadingScreen = ({ message }: { message?: string }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    {message && <p className="text-lg font-medium">{message}</p>}
  </div>
);

export default Assistant;
