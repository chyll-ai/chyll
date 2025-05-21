
import React, { useRef, useEffect } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';
import { Message } from '@/hooks/useAssistantChat';

interface ChatMessageListProps {
  messages: Message[];
  onProcessToolCalls?: (toolCalls: any[]) => void;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ 
  messages, 
  onProcessToolCalls 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
    
    // Process any tool calls that might have been received with the latest message
    // This needs to be handled externally since we want to only process tool calls once
    // and the useEffect will re-run every time messages changes
    if (messages.length > 0 && onProcessToolCalls) {
      // Check if the latest message has any tool calls attached to it
      const latestMessage = messages[messages.length - 1];
      if (latestMessage && (latestMessage as any).toolCalls) {
        console.log("Found tool calls in latest message:", (latestMessage as any).toolCalls);
        onProcessToolCalls((latestMessage as any).toolCalls);
      }
    }
  }, [messages, onProcessToolCalls]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">
          Pas de messages. Commencez une conversation!
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage 
            key={message.id || index} 
            message={message} 
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
