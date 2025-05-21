
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Menu, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  sidebarVisible: boolean;
  onNewChat: () => void;
  sessionTitle: string | null;
  apiStatus?: 'connected' | 'error' | 'unknown';
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onToggleSidebar,
  sidebarVisible,
  onNewChat,
  sessionTitle,
  apiStatus = 'unknown'
}) => {
  return (
    <header className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
          <Menu size={20} />
        </Button>
        
        {!sidebarVisible && (
          <Link to="/" className="mr-2 hover:text-primary">
            <ArrowLeft size={20} />
          </Link>
        )}
        
        <h1 className="text-xl font-semibold truncate max-w-[200px] md:max-w-md">
          {sessionTitle || "Nouvelle conversation"}
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={onNewChat}>
              <Plus size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Nouvelle conversation</TooltipContent>
        </Tooltip>
        
        {apiStatus === 'error' ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse ml-1"></div>
            </TooltipTrigger>
            <TooltipContent>Erreur de connexion à l'API</TooltipContent>
          </Tooltip>
        ) : apiStatus === 'connected' ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
            </TooltipTrigger>
            <TooltipContent>API connectée</TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse ml-1"></div>
            </TooltipTrigger>
            <TooltipContent>Statut de l'API inconnu</TooltipContent>
          </Tooltip>
        )}
      </div>
    </header>
  );
};

export default ChatHeader;
