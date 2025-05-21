
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, History, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface ChatSession {
  id: string;
  title: string | null;
  created_at: string | null;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewChat,
  isLoading = false,
  error = null,
}) => {
  return (
    <div className="w-64 border-r flex flex-col h-full bg-muted/30">
      <div className="p-4">
        <Button 
          onClick={onNewChat} 
          className="w-full flex items-center gap-2"
          variant="outline"
        >
          <Plus size={16} />
          <span>Nouvelle conversation</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <History size={14} />
          <span>Historique des conversations</span>
        </div>
        
        {error && (
          <div className="text-sm text-red-500 p-2 border border-red-200 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        
        {isLoading ? (
          <div className="flex items-center justify-center p-4 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Chargement...</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-sm text-center text-muted-foreground p-4">
            Aucune conversation
          </div>
        ) : (
          sessions.map((session) => (
            <Button
              key={session.id}
              variant={session.id === currentSessionId ? "secondary" : "ghost"}
              className="w-full justify-start text-sm h-auto py-2 overflow-hidden"
              onClick={() => onSessionSelect(session.id)}
            >
              <div className="truncate text-left">
                <div className="font-medium truncate">
                  {session.title || "Nouvelle conversation"}
                </div>
                {session.created_at && (
                  <div className="text-xs text-muted-foreground truncate">
                    {formatDistanceToNow(new Date(session.created_at), { addSuffix: true, locale: fr })}
                  </div>
                )}
              </div>
            </Button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;
