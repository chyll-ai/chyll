
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAssistantChat from '@/hooks/useAssistantChat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInputForm from '@/components/chat/ChatInputForm';
import { toast } from '@/components/ui/sonner';

const Assistant = () => {
  const navigate = useNavigate();
  const {
    loading,
    sending,
    messages,
    sendMessage,
    userId,
  } = useAssistantChat();
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!loading && !userId) {
      console.log("Utilisateur non connecté, redirection vers login");
      toast.error("Veuillez vous connecter pour accéder à cette page");
      navigate('/login');
    }
  }, [loading, userId, navigate]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-4">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
          <p className="text-lg">Chargement de l'assistant...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      <ChatMessageList messages={messages} />
      <ChatInputForm onSendMessage={sendMessage} disabled={sending} />
    </div>
  );
};

export default Assistant;
