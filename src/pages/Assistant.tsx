import React from 'react';
import { useSearchParams } from 'react-router-dom';
import useAssistantChat from '@/hooks/assistant/useAssistantChat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInputForm from '@/components/chat/ChatInputForm';
import { Loader2 } from 'lucide-react';
import { AssistantService } from '@/services/assistant/index';

interface AssistantProps {
  embedded?: boolean;
  assistantService?: AssistantService;
}

const Assistant = ({ embedded = false, assistantService }: AssistantProps) => {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('leadId');
  const {
    loading: chatLoading,
    sending,
    isGenerating,
    messages,
    sendMessage,
  } = useAssistantChat(assistantService);

  // Show loading state while initializing chat
  if (chatLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${embedded ? 'h-full' : 'h-screen'}`}>
      {!embedded && (
        <ChatHeader 
          showBackButton={true}
          backTo={leadId ? '/dashboard' : '/'}
        />
      )}

      <div className="flex-1 overflow-y-auto">
        <ChatMessageList 
          messages={messages} 
          isGenerating={isGenerating}
        />
      </div>

      <div className="border-t border-border p-4 bg-background">
        <ChatInputForm 
          onSubmit={sendMessage} 
          disabled={sending || isGenerating} 
          loading={sending}
          placeholder="Demandez-moi de trouver des leads ou de vous aider avec vos prospects..."
        />
      </div>
    </div>
  );
};

export default Assistant;
