
import React, { useRef, useEffect } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';
import { Message } from '@/hooks/useAssistantChat';

interface ChatMessageListProps {
  messages: Message[];
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <ChatMessage key={message.id || index} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
