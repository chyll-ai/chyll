
import React, { useCallback } from 'react';
import useAssistantChat from '@/hooks/assistant/useAssistantChat';
import { handleFunctionCall } from '@/lib/handleFunctionCall';
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
    userId,
    hasProfile,
    conversationId
  } = useAssistantChat();
  
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
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader conversationId={conversationId} />
      <ChatMessageList messages={messages} onProcessToolCalls={processToolCalls} />
      <ChatInputForm onSendMessage={sendMessage} disabled={sending} />
    </div>
  );
};

export default Assistant;
