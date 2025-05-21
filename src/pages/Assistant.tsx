
import React, { useCallback } from 'react';
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
    threadId,
    currentRunId,
    handleFunctionCall
  } = useAssistantChat();
  
  // Handle any tool calls from the assistant
  const processToolCalls = useCallback((toolCalls) => {
    if (!toolCalls || !Array.isArray(toolCalls)) return;
    
    console.log("Processing tool calls:", toolCalls);
    
    toolCalls.forEach(toolCall => {
      if (toolCall.type === 'function' && toolCall.function?.name === 'connect_gmail' && threadId && currentRunId) {
        console.log("Gmail connection tool call detected, processing...");
        handleFunctionCall(toolCall, threadId, currentRunId);
      } else {
        console.log("Unknown or unhandled tool call:", toolCall);
      }
    });
  }, [handleFunctionCall, threadId, currentRunId]);
  
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
      <ChatMessageList messages={messages} onProcessToolCalls={processToolCalls} />
      <ChatInputForm onSendMessage={sendMessage} disabled={sending} />
    </div>
  );
};

export default Assistant;
