
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
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <p className="mb-2 font-bold">Start a conversation</p>
          <p className="text-sm">Ask the assistant a question to get started.</p>
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg inline-block">
            <code className="text-xs text-left block">
              Status: ready to chat<br />
              Messages: {messages.length}<br />
              Supported roles: user, assistant
            </code>
          </div>
        </div>
      ) : (
        messages.map((message, index) => (
          <ChatMessage 
            key={message.id || index} 
            message={message} 
          />
        ))
      )}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};

export default ChatMessageList;
