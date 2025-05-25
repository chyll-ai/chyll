import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

export interface ChatInputFormProps {
  onSubmit: (content: string) => void;
  disabled?: boolean;
  loading?: boolean;
  placeholder?: string;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ 
  onSubmit, 
  disabled = false, 
  loading = false,
  placeholder = "Type your message..."
}) => {
  const [content, setContent] = useState('');
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (content.trim() && !disabled) {
      onSubmit(content);
      setContent('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="min-h-[44px] max-h-[200px]"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
      />
      <Button 
        type="submit" 
        disabled={!content.trim() || disabled}
        className="px-3"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};

export default ChatInputForm;
