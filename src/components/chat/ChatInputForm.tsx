
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputFormProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSendMessage, disabled }) => {
  const [inputMessage, setInputMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || disabled) return;
    
    onSendMessage(inputMessage);
    setInputMessage('');
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
        >
          <Send className="h-4 w-4 mr-2" />
          Envoyer
        </Button>
      </form>
    </footer>
  );
};

export default ChatInputForm;
