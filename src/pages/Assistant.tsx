import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAssistantChat from '@/hooks/assistant/useAssistantChat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInputForm from '@/components/chat/ChatInputForm';
import { Loader2 } from 'lucide-react';

interface AssistantProps {
  embedded?: boolean;
}

const Assistant = ({ embedded = false }: AssistantProps) => {
  const {
    loading,
    sending,
    isGenerating,
    messages,
    sendMessage,
    conversationId,
  } = useAssistantChat();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${embedded ? 'h-full' : 'h-screen'} bg-background`}>
      <ChatHeader conversationId={conversationId} showBackButton={!embedded} />
      <ChatMessageList 
        messages={messages} 
        isGenerating={isGenerating}
      />
      <ChatInputForm 
        onSendMessage={sendMessage} 
        disabled={sending || isGenerating} 
      />
    </div>
  );
};

export default Assistant;
