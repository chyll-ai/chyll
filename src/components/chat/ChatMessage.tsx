
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, timestamp }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex gap-3 p-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="/bot-avatar.svg" alt="AI Assistant" />
          <AvatarFallback>
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            isUser
              ? 'bg-primary text-primary-foreground ml-auto'
              : 'bg-muted text-foreground'
          }`}
        >
          <div className="whitespace-pre-wrap break-words">{content}</div>
          {timestamp && (
            <div className={`text-xs mt-1 opacity-70 ${isUser ? 'text-right' : 'text-left'}`}>
              {timestamp}
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src="/user-avatar.svg" alt="User" />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default ChatMessage;
