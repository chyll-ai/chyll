import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, MessageSquareText } from 'lucide-react';

interface ChatHeaderProps {
  showBackButton?: boolean;
  backTo?: string;
  conversationId?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  showBackButton = false,
  backTo = '/',
  conversationId 
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Link to={backTo} className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Retour</span>
          </Link>
        )}
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">Assistant</h1>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
