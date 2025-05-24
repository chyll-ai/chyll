
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { MessageSquareText, ChevronLeft } from 'lucide-react';

interface ChatHeaderProps {
  conversationId?: string | null;
  showBackButton?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversationId, showBackButton = true }) => {
  const [title, setTitle] = useState('Assistant');
  
  useEffect(() => {
    const fetchConversationTitle = async () => {
      if (!conversationId) return;
      
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('title')
          .eq('id', conversationId)
          .single();
          
        if (error) {
          console.error("Erreur lors de la récupération du titre de la conversation:", error);
          return;
        }
        
        if (data && data.title) {
          setTitle(data.title);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du titre de la conversation:", error);
      }
    };
    
    fetchConversationTitle();
  }, [conversationId]);
  
  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-card">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Link to="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Retour</span>
          </Link>
        )}
        <div className="flex items-center gap-2">
          <MessageSquareText className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
