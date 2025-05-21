
import React from 'react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  toolCalls?: any[];
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Check if the message has empty content but contains tool calls
  const hasToolCallsOnly = message.content === '' && message.toolCalls && message.toolCalls.length > 0;
  
  // Determine what content to display
  let displayContent = message.content;
  
  // If we have a message with tool calls but no content, provide a default message
  if (hasToolCallsOnly) {
    displayContent = "Je traite votre demande...";
    
    // Add more specific messages for known tool calls
    if (message.toolCalls.some(tool => tool.function?.name === 'connect_gmail')) {
      displayContent = "Je prépare la connexion à Gmail...";
    }
  }
  
  return (
    <div className={cn(
      'flex',
      isUser ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'max-w-[80%] px-4 py-2 rounded-lg',
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'
      )}>
        {message.content === '...' ? (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{displayContent}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
