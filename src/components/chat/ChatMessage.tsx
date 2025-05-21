
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

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
  
  // Check for Gmail connection tool call
  const hasGmailToolCall = message.toolCalls?.some(
    tool => tool.type === 'function' && tool.function?.name === 'connect_gmail'
  );
  
  // Extract OAuth URL from function arguments if available
  let oauthUrl = '';
  if (hasGmailToolCall) {
    const gmailToolCall = message.toolCalls?.find(
      tool => tool.type === 'function' && tool.function?.name === 'connect_gmail'
    );
    try {
      if (gmailToolCall) {
        const args = JSON.parse(gmailToolCall.function.arguments || '{}');
        oauthUrl = args.url || '';
      }
    } catch (e) {
      console.error('Error parsing tool call arguments:', e);
    }
  }
  
  // Determine what content to display
  let displayContent = message.content;
  
  // If we have a message with tool calls but no content, provide a default message
  if (hasToolCallsOnly) {
    displayContent = "Je traite votre demande...";
    
    // Add more specific messages for known tool calls
    if (hasGmailToolCall) {
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
          <div>
            <p className="whitespace-pre-wrap">{displayContent}</p>
            
            {hasGmailToolCall && (
              <div className="mt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2 text-sm"
                  onClick={() => window.open('https://accounts.google.com/o/oauth2/auth', '_blank')}
                >
                  <ExternalLink size={16} />
                  Connecter Gmail
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
