import React, { useRef, useEffect } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';
import { Message } from '@/types/assistant';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/avatar';
import { TypingIndicator } from './TypingIndicator';
import useAssistantChat from '@/hooks/assistant/useAssistantChat';

interface ChatMessageListProps {
  messages: Message[];
  onProcessToolCalls?: (toolCalls: any[]) => void;
  className?: string;
}

const ChatMessageList = ({ messages, onProcessToolCalls, className }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isGenerating } = useAssistantChat();
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (onProcessToolCalls) {
      messages.forEach(message => {
        if (message.role === 'assistant' && message.toolCalls) {
          onProcessToolCalls(message.toolCalls);
        }
      });
    }
  }, [messages, onProcessToolCalls]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <div className={cn('flex-1 overflow-y-auto p-4 space-y-4', className)}>
      {messages.length === 0 ? (
        <div className="text-center text-gray-500">
          Pas de messages. Commencez une conversation!
        </div>
      ) : (
        messages.map((message, index) => (
          <div
            key={message.id || index}
            className={cn(
              'flex items-start gap-3 text-sm',
              message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
            )}
          >
            <Avatar className="mt-0.5 h-8 w-8">
              <div className={cn(
                'h-full w-full rounded-full',
                message.role === 'assistant' ? 'bg-primary' : 'bg-muted'
              )} />
            </Avatar>
            <div className={cn(
              'rounded-lg px-4 py-2 max-w-[85%]',
              message.role === 'assistant' ? 'bg-muted' : 'bg-primary text-primary-foreground'
            )}>
              {message.content}
            </div>
          </div>
        ))
      )}
      
      {isGenerating && (
        <div className="flex items-start gap-3">
          <Avatar className="mt-0.5 h-8 w-8">
            <div className="h-full w-full rounded-full bg-primary" />
          </Avatar>
          <div className="rounded-lg px-4 py-2 bg-muted">
            <TypingIndicator />
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
