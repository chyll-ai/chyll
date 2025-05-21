
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAssistantChat from '@/hooks/useAssistantChat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInputForm from '@/components/chat/ChatInputForm';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { toast } from '@/components/ui/sonner';
import { AlertTriangle, ArrowRight, BugIcon, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Assistant = () => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [apiStatus, setApiStatus] = useState<'connected' | 'error' | 'unknown'>('unknown');
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // Message de débogage visible au chargement
  const [isPageLoaded, setIsPageLoaded] = useState(true);
  
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
    apiError,
  } = useAssistantChat();

  // Vérifier l'authentification avant tout et empêcher les redirections non voulues
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Vérification d'authentification dans Assistant");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erreur lors de la vérification de session:", error);
          setLoadError(`Erreur d'authentification: ${error.message}`);
          setAuthChecking(false);
          return;
        }
        
        if (!data.session) {
          console.log("Pas de session active dans Assistant");
          setLoadError("Aucune session utilisateur active. Veuillez vous connecter.");
          setAuthChecking(false);
          return;
        }
        
        console.log("Session authentifiée trouvée:", data.session.user);
        setUser(data.session.user);
        setAuthChecking(false);
      } catch (error) {
        console.error("Erreur inattendue dans Assistant:", error);
        setLoadError(`Erreur inattendue: ${error instanceof Error ? error.message : 'Inconnue'}`);
        setAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Charger les sessions de chat - avec gestion d'erreurs améliorée
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSessions = async () => {
      if (!userId) return;
      
      try {
        console.log("Chargement des sessions pour l'utilisateur:", userId);
        setSessionsLoading(true);
        setSessionsError(null);
        
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('client_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log("Sessions chargées avec succès:", data?.length || 0);
        setSessions(data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des sessions:", error);
        setSessionsError(`Impossible de charger les sessions: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
          () => {
            console.log("Changement détecté dans les sessions, rechargement");
            fetchSessions();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);
  
  // Vérifier le statut de l'API OpenAI - une seule tentative
  const [apiChecked, setApiChecked] = useState(false);
  
  useEffect(() => {
    const checkApiStatus = async () => {
      if (!userId || apiChecked) return;
      
      try {
        console.log("Vérification du statut de l'API OpenAI...");
        setApiChecked(true);
        
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
  }, [userId, apiChecked]);
  
  // Vérifier s'il y a une session active stockée
  useEffect(() => {
    const storedSessionId = localStorage.getItem('current_chat_session_id');
    if (storedSessionId && userId) {
      console.log("Session stockée trouvée:", storedSessionId);
      setCurrentSessionId(storedSessionId);
    } else {
      console.log("Aucune session stockée trouvée");
    }
  }, [userId, setCurrentSessionId]);
  
  // Créer une nouvelle conversation
  const handleNewChat = async () => {
    if (!userId) {
      console.error("Impossible de créer une nouvelle conversation: utilisateur non connecté");
      toast.error("Vous devez être connecté pour créer une conversation");
      return;
    }
    
    try {
      console.log("Création d'une nouvelle conversation");
      const newSessionId = await createChatSession();
      if (newSessionId) {
        setCurrentSessionId(newSessionId);
        console.log("Nouvelle conversation créée:", newSessionId);
      } else {
        throw new Error("Erreur lors de la création de la session");
      }
    } catch (error) {
      console.error("Échec de la création d'une nouvelle conversation:", error);
      toast.error("Impossible de créer une nouvelle conversation");
    }
  };
  
  // Sélectionner une conversation existante
  const handleSessionSelect = (sessionId: string) => {
    console.log("Sélection de la session:", sessionId);
    setCurrentSessionId(sessionId);
  };
  
  // Gérer l'affichage sur mobile
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };
  
  // Afficher un message de débogage visible
  const DebugBanner = () => (
    <div className="bg-green-100 py-1 px-2 text-center text-sm font-bold text-green-800 border-b border-green-300">
      Assistant actif - Page chargée correctement
    </div>
  );
  
  // Afficher les informations utilisateur en haut de la page
  const UserInfo = () => (
    <div className="bg-muted/20 text-xs py-1 px-2 text-center border-b">
      {user ? (
        <span className="font-mono">
          Connecté en tant que: {user?.email || 'Unknown'} | 
          User ID: {user?.id ? `${user.id.substring(0, 8)}...` : 'Unknown'}
        </span>
      ) : (
        <span className="font-mono text-red-500 font-bold">Connexion requise</span>
      )}
    </div>
  );
  
  // Afficher un écran de chargement
  if (authChecking || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DebugBanner />
        <UserInfo />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-4">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
            </div>
            <p className="text-lg">Chargement de l'assistant...</p>
            <p className="text-sm text-gray-500 mt-2">Vérification de l'authentification et initialisation...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Afficher un message d'erreur générique si un problème empêche le chargement
  if (loadError) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DebugBanner />
        <UserInfo />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
            <div className="flex justify-center mb-4 text-amber-500">
              <BugIcon size={48} />
            </div>
            <h2 className="text-2xl font-bold mb-4">Erreur de chargement</h2>
            <p className="mb-6 text-gray-700">
              {loadError}
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-2">
              <Button onClick={() => navigate('/')} variant="outline">
                Retour à l'accueil
              </Button>
              <Button onClick={() => window.location.reload()} className="flex items-center gap-1">
                <RefreshCw size={16} /> Rafraîchir la page
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Afficher un message d'erreur si l'API n'est pas disponible
  if (apiStatus === 'error') {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <DebugBanner />
        <UserInfo />
        <div className="flex-1 flex items-center justify-center">
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
              <Button onClick={() => navigate('/')} variant="outline" className="mr-2">
                Retour à l'accueil
              </Button>
              <Button onClick={() => {
                setApiChecked(false);
                window.location.reload();
              }} className="flex items-center gap-1">
                Réessayer <ArrowRight size={16} />
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Si le problème persiste, contactez l'administrateur pour vérifier la configuration de l'API des assistants.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <DebugBanner />
      <UserInfo />
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Sidebar pour les conversations - toujours visible si sidebarVisible est true */}
        {sidebarVisible && (
          <div className="w-64 border-r border-border bg-muted/20 h-full overflow-y-auto flex-shrink-0">
            <ChatSidebar
              sessions={sessions}
              currentSessionId={currentSessionId}
              onSessionSelect={handleSessionSelect}
              onNewChat={handleNewChat}
              isLoading={sessionsLoading}
              error={sessionsError}
            />
          </div>
        )}
        
        {/* Contenu principal - toujours visible */}
        <div className="flex flex-col flex-1 h-full overflow-hidden">
          <ChatHeader 
            onToggleSidebar={toggleSidebar} 
            sidebarVisible={sidebarVisible}
            onNewChat={handleNewChat}
            sessionTitle={currentSessionId ? sessions.find(s => s.id === currentSessionId)?.title : null}
            apiStatus={apiStatus}
          />
          
          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-2">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Erreur API: {apiError}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Section Chat ou Message d'accueil - toujours visible */}
          <div className="flex-1 flex flex-col overflow-hidden">
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
                    {sessions.length > 0 
                      ? "Sélectionnez une conversation existante ou commencez-en une nouvelle."
                      : "Commencez une nouvelle conversation pour interagir avec l'assistant."}
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
      </div>
    </div>
  );
};

export default Assistant;
