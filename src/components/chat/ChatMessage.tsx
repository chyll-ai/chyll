
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
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
  
  // Check for Gmail send email tool call
  const hasGmailSendEmailToolCall = message.toolCalls?.some(
    tool => tool.type === 'function' && tool.function?.name === 'send_gmail_email'
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
        // Look for url in arguments or in output field if available
        oauthUrl = args.url || '';
      }
    } catch (e) {
      console.error('Error parsing tool call arguments:', e);
    }
  }
  
  // Extract email details if available
  let emailDetails = null;
  if (hasGmailSendEmailToolCall) {
    const sendEmailToolCall = message.toolCalls?.find(
      tool => tool.type === 'function' && tool.function?.name === 'send_gmail_email'
    );
    try {
      if (sendEmailToolCall) {
        const args = JSON.parse(sendEmailToolCall.function.arguments || '{}');
        emailDetails = {
          to: args.to,
          subject: args.subject
        };
      }
    } catch (e) {
      console.error('Error parsing email tool call arguments:', e);
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
    } else if (hasGmailSendEmailToolCall) {
      displayContent = "Je prépare l'envoi d'un email...";
    }
  }
  
  return (
    <div className={cn(
      'flex items-start gap-2',
      isUser ? 'flex-row-reverse' : 'flex-row'
    )}>
      <div className="flex-shrink-0 w-8 h-8">
        <img
          src={isUser ? '/user-avatar.svg' : '/bot-avatar.svg'}
          alt={isUser ? 'User Avatar' : 'Assistant Avatar'}
          className="w-full h-full rounded-full"
          width={32}
          height={32}
        />
      </div>
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
                  onClick={() => {
                    // Use the extracted OAuth URL if available, otherwise use a fallback
                    const urlToOpen = oauthUrl || '';
                    if (urlToOpen) {
                      console.log("Opening OAuth URL:", urlToOpen);
                      // Open in a new tab and set a consistent redirect URL
                      window.open(urlToOpen, '_blank');
                    } else {
                      console.error("No OAuth URL found in tool call");
                    }
                  }}
                >
                  <ExternalLink size={16} />
                  Connecter Gmail
                </Button>
              </div>
            )}
            
            {hasGmailSendEmailToolCall && emailDetails && (
              <div className="mt-3 p-3 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={16} />
                  <span className="font-semibold">Email en cours d'envoi</span>
                </div>
                <p className="text-sm"><span className="font-medium">À:</span> {emailDetails.to}</p>
                <p className="text-sm"><span className="font-medium">Sujet:</span> {emailDetails.subject}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
