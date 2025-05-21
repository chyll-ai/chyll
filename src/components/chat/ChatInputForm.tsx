
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface ChatInputFormProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSendMessage, disabled }) => {
  const [inputMessage, setInputMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) {
      return;
    }
    
    if (disabled) {
      toast.error("Veuillez patienter, un message est déjà en cours d'envoi");
      return;
    }
    
    try {
      onSendMessage(inputMessage);
      setInputMessage('');
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      toast.error("Impossible d'envoyer le message. Veuillez réessayer.");
    }
  };
  
  return (
    <footer className="border-t p-4 bg-background">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Tapez votre message..."
          disabled={disabled}
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!inputMessage.trim() || disabled}
          aria-label="Envoyer le message"
        >
          <Send className="h-4 w-4 mr-2" />
          Envoyer
        </Button>
      </form>
    </footer>
  );
};

export default ChatInputForm;
