
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";

interface ChatButtonProps {
  leadId?: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | 
            "ghost" | "link" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

const ChatButton = ({ 
  leadId, 
  className, 
  variant = "outline", 
  size = "sm" 
}: ChatButtonProps) => {
  const [navigating, setNavigating] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToChat = async () => {
    try {
      setNavigating(true);
      
      // If no leadId provided (homepage usage), navigate to login
      if (!leadId) {
        navigate('/login');
        return;
      }
      
      // Navigate to the assistant page with the lead ID
      navigate(`/assistant?leadId=${leadId}`);
      
    } catch (error) {
      console.error("Error navigating to chat:", error);
      toast.error("Could not navigate to the chat page");
    } finally {
      setNavigating(false);
    }
  };

  return (
    <Button
      onClick={handleNavigateToChat}
      disabled={navigating}
      className={className}
      variant={variant}
      size={size}
    >
      {navigating ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Opening...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {leadId ? "Chat" : "Essayer maintenant"}
        </span>
      )}
    </Button>
  );
};

export default ChatButton;
