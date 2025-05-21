
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAssistantChat from '@/hooks/useAssistantChat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInputForm from '@/components/chat/ChatInputForm';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { toast } from '@/components/ui/sonner';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Assistant = () => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'unknown'>('unknown');
  
  const {
    loading,
    sending,
    messages,
    sendMessage,
    userId,
    hasProfile,
    currentSessionId,
    setCurrentSessionId,
    createChatSession,
    fetchMessages,
  } = useAssistantChat();
  
  // Charger les sessions de chat
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  
  useEffect(() => {
    const fetchSessions = async () => {
      if (!userId) return;
      
      try {
        setSessionsLoading(true);
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('client_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setSessions(data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des sessions:", error);
        toast.error("Impossible de charger l'historique des conversations");
      } finally {
        setSessionsLoading(false);
      }
    };
    
    if (userId) {
      fetchSessions();
      
      // Écouter les changements dans les sessions
      const channel = supabase
        .channel('chat_sessions_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'chat_sessions',
            filter: `client_id=eq.${userId}`
          }, 
          () => fetchSessions()
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);
  
  // Vérifier le statut de l'API OpenAI
  useEffect(() => {
    const checkApiStatus = async () => {
      if (!userId) return;
      
      try {
        console.log("Vérification du statut de l'API OpenAI...");
        // Tentative de création d'un thread pour vérifier l'API
        const baseUrl = 'https://atsfuqwxfrezkxtnctmk.supabase.co';
        const response = await fetch(`${baseUrl}/functions/v1/openai-assistant`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE`
          },
          body: JSON.stringify({
            action: 'create_thread'
          })
        });
        
        const data = await response.json();
        
        if (response.ok && data.threadId) {
          console.log("API OpenAI connectée avec succès, thread créé:", data.threadId);
          setApiStatus('connected');
        } else {
          // Analyser l'erreur pour fournir un message plus précis
          console.error("Erreur API:", data);
          
          setApiStatus('error');
          toast.error("Impossible de se connecter à l'API OpenAI. Vérifiez la configuration de l'API.");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'API:", error);
        setApiStatus('error');
      }
    };
    
    if (userId) {
      checkApiStatus();
    }
  }, [userId]);
  
  // Vérifier s'il y a une session active stockée
  useEffect(() => {
    const storedSessionId = localStorage.getItem('current_chat_session_id');
    if (storedSessionId && userId) {
      setCurrentSessionId(storedSessionId);
    }
  }, [userId, setCurrentSessionId]);
  
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!loading && !userId) {
      console.log("Utilisateur non connecté, redirection vers login");
      toast.error("Veuillez vous connecter pour accéder à cette page");
      navigate('/login');
    }
  }, [loading, userId, navigate]);
  
  // Créer une nouvelle conversation
  const handleNewChat = async () => {
    if (!userId) return;
    
    const newSessionId = await createChatSession();
    if (newSessionId) {
      setCurrentSessionId(newSessionId);
    }
  };
  
  // Sélectionner une conversation existante
  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };
  
  // Gérer l'affichage sur mobile
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };
  
  // Afficher un écran de chargement
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
  
  // Afficher un message d'erreur si l'API n'est pas disponible
  if (apiStatus === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center mb-4 text-red-500">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-2xl font-bold mb-4">Erreur de configuration</h2>
          <p className="mb-6 text-gray-700">
            Impossible de se connecter à l'API OpenAI. La clé API OpenAI n'est pas configurée correctement 
            ou l'API des assistants v2 est inaccessible. Veuillez vérifier votre clé API et réessayer.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-2">
            <Button onClick={() => navigate('/')} className="mr-2">
              Retour à l'accueil
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="flex items-center gap-1">
              Réessayer <ArrowRight size={16} />
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            Si le problème persiste, contactez l'administrateur pour vérifier la configuration de l'API des assistants.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar pour les conversations */}
      {sidebarVisible && (
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
        />
      )}
      
      {/* Contenu principal */}
      <div className="flex flex-col flex-1 h-full">
        <ChatHeader 
          onToggleSidebar={toggleSidebar} 
          sidebarVisible={sidebarVisible}
          onNewChat={handleNewChat}
          sessionTitle={currentSessionId ? sessions.find(s => s.id === currentSessionId)?.title : null}
          apiStatus={apiStatus}
        />
        
        {currentSessionId ? (
          <>
            <ChatMessageList messages={messages} />
            <ChatInputForm onSendMessage={sendMessage} disabled={sending} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="max-w-md text-center">
              <h2 className="text-2xl font-bold mb-4">Bienvenue dans l'assistant Chyll</h2>
              <p className="mb-6 text-muted-foreground">
                Commencez une nouvelle conversation ou sélectionnez une conversation existante dans la barre latérale.
              </p>
              <button
                onClick={handleNewChat}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Nouvelle conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Ajouter l'import de supabase
import { supabase } from '@/integrations/supabase/client';

export default Assistant;
