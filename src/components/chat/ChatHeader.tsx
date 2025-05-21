
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatHeaderProps {
  onToggleSidebar: () => void;
  sidebarVisible: boolean;
  onNewChat: () => void;
  sessionTitle: string | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onToggleSidebar,
  sidebarVisible,
  onNewChat,
  sessionTitle
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
          {sessionTitle || "Nouvel assistant"}
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
        
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-1"></div>
      </div>
    </header>
  );
};

export default ChatHeader;
