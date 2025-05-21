
import React from 'react';
import useAssistantChat from '@/hooks/useAssistantChat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInputForm from '@/components/chat/ChatInputForm';

const Assistant = () => {
  const {
    loading,
    sending,
    messages,
    sendMessage,
  } = useAssistantChat();
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      <ChatMessageList messages={messages} />
      <ChatInputForm onSendMessage={sendMessage} disabled={sending} />
    </div>
  );
};

export default Assistant;
