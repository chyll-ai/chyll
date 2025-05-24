import React, { useRef, useEffect } from 'react';
import ChatMessage from '@/components/chat/ChatMessage';
import { Message } from '@/types/assistant';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TypingIndicator } from './TypingIndicator';
import useAssistantChat from '@/hooks/assistant/useAssistantChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User } from 'lucide-react';

interface ChatMessageListProps {
  messages: Message[];
  onProcessToolCalls?: (toolCalls: any[]) => void;
  className?: string;
  isGenerating?: boolean;
}

const ChatMessageList = ({ messages, onProcessToolCalls, className, isGenerating = false }: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isGenerating: assistantIsGenerating } = useAssistantChat();
  
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
    <ScrollArea className={cn('flex-1 overflow-y-auto p-4 space-y-4', className)}>
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500">
            Pas de messages. Commencez une conversation!
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id || index}
              className={cn(
                'flex w-full gap-3 rounded-lg p-4',
                message.role === 'assistant' ? 'bg-muted/50' : 'bg-background'
              )}
            >
              <Avatar className="h-8 w-8">
                {message.role === 'assistant' ? (
                  <>
                    <AvatarImage src="/bot-avatar.png" alt="Assistant" />
                    <AvatarFallback>
                      <Bot className="h-5 w-5" />
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/user-avatar.png" alt="User" />
                    <AvatarFallback>
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isGenerating && (
          <div className="flex w-full gap-3 rounded-lg p-4 bg-muted/50">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/bot-avatar.png" alt="Assistant" />
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatMessageList;
