import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ChatInputFormProps {
  onSubmit: (message: string) => void;
  disabled: boolean;
  loading?: boolean;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSubmit, disabled, loading = false }) => {
  const [inputMessage, setInputMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) {
      return;
    }
    
    if (disabled) {
      toast.error("Please wait, a message is already being sent");
      return;
    }
    
    try {
      onSubmit(inputMessage);
      setInputMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };
  
  return (
    <footer className="border-t p-4 bg-background">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!inputMessage.trim() || disabled}
          aria-label="Send message"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Send
        </Button>
      </form>
    </footer>
  );
};

export default ChatInputForm;
