
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
  
  // Make sure the page is visible
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

  // Check authentication before anything and prevent unwanted redirects
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication in Assistant");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setLoadError(`Authentication error: ${error.message}`);
          setAuthChecking(false);
          return;
        }
        
        if (!data.session) {
          console.log("No active session in Assistant");
          setLoadError("No active user session. Please login.");
          setAuthChecking(false);
          // Redirect to login
          navigate('/login');
          return;
        }
        
        console.log("Authenticated session found:", data.session.user);
        setUser(data.session.user);
        setAuthChecking(false);
      } catch (error) {
        console.error("Unexpected error in Assistant:", error);
        setLoadError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown'}`);
        setAuthChecking(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  // Load chat sessions - with improved error handling
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSessions = async () => {
      if (!userId) return;
      
      try {
        console.log("Loading sessions for user:", userId);
        setSessionsLoading(true);
        setSessionsError(null);
        
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('client_id', userId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log("Sessions loaded successfully:", data?.length || 0);
        setSessions(data || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setSessionsError(`Unable to load sessions: ${error instanceof Error ? error.message : 'Unknown error'}`);
        toast.error("Unable to load conversation history");
      } finally {
        setSessionsLoading(false);
      }
    };
    
    if (userId) {
      fetchSessions();
      
      // Listen for changes in sessions
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
            console.log("Change detected in sessions, reloading");
            fetchSessions();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId]);
  
  // Check OpenAI API status - one attempt only
  const [apiChecked, setApiChecked] = useState(false);
  
  useEffect(() => {
    const checkApiStatus = async () => {
      if (!userId || apiChecked) return;
      
      try {
        console.log("Checking OpenAI API status...");
        setApiChecked(true);
        
        // Try creating a thread to verify API
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
          console.log("OpenAI API connected successfully, thread created:", data.threadId);
          setApiStatus('connected');
        } else {
          // Analyze error for more precise message
          console.error("API error:", data);
          
          setApiStatus('error');
          toast.error("Unable to connect to OpenAI API. Check API configuration.");
        }
      } catch (error) {
        console.error("Error checking API:", error);
        setApiStatus('error');
      }
    };
    
    if (userId) {
      checkApiStatus();
    }
  }, [userId, apiChecked]);
  
  // Check if there's a stored active session
  useEffect(() => {
    const storedSessionId = localStorage.getItem('current_chat_session_id');
    if (storedSessionId && userId) {
      console.log("Found stored session:", storedSessionId);
      setCurrentSessionId(storedSessionId);
    } else {
      console.log("No stored session found");
    }
  }, [userId, setCurrentSessionId]);
  
  // Create new conversation
  const handleNewChat = async () => {
    if (!userId) {
      console.error("Cannot create new conversation: user not logged in");
      toast.error("You must be logged in to create a conversation");
      return;
    }
    
    try {
      console.log("Creating new conversation");
      const newSessionId = await createChatSession();
      if (newSessionId) {
        setCurrentSessionId(newSessionId);
        console.log("New conversation created:", newSessionId);
      } else {
        throw new Error("Error creating session");
      }
    } catch (error) {
      console.error("Failed to create new conversation:", error);
      toast.error("Unable to create new conversation");
    }
  };
  
  // Select existing conversation
  const handleSessionSelect = (sessionId: string) => {
    console.log("Selecting session:", sessionId);
    setCurrentSessionId(sessionId);
  };
  
  // Handle mobile display
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };
  
  // Display visible debug message
  const DebugBanner = () => (
    <div className="bg-green-100 py-1 px-2 text-center text-sm font-bold text-green-800 border-b border-green-300">
      Assistant actif - Page chargée correctement
    </div>
  );
  
  // Display user info at top of page
  const UserInfo = () => (
    <div className="bg-muted/20 text-xs py-1 px-2 text-center border-b">
      {user ? (
        <span className="font-mono">
          Connecté en tant que: {user?.email || 'Inconnu'} | 
          User ID: {user?.id ? `${user.id.substring(0, 8)}...` : 'Inconnu'}
        </span>
      ) : (
        <span className="font-mono text-red-500 font-bold">Connexion requise</span>
      )}
    </div>
  );
  
  // Display loading screen
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
  
  // Display generic error message if a problem prevents loading
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
  
  // Display error message if API is unavailable
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
              ou l'API Assistants v2 est inaccessible. Veuillez vérifier votre clé API et réessayer.
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
              Si le problème persiste, contactez l'administrateur pour vérifier la configuration de l'API Assistants.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Main UI - always render this if no errors
  return (
    <div className="flex flex-col h-screen bg-background">
      <DebugBanner />
      <UserInfo />
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Sidebar for conversations - always visible if sidebarVisible is true */}
        {sidebarVisible && (
          <div className="w-64 border-r border-border bg-muted/20 h-full overflow-y-auto flex-shrink-0">
            <ChatSidebar
              sessions={sessions}
              currentSessionId={currentSessionId}
              onSessionSelect={handleSessionSelect}
              onNewChat={handleNewChat}
              isLoading={sessionsLoading}
              error={sessionsError || null}
            />
          </div>
        )}
        
        {/* Main content - always visible */}
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
                    API Error: {apiError}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Chat Section or Welcome Message - ALWAYS VISIBLE */}
          <div className="flex-1 flex flex-col overflow-hidden border border-gray-200 m-2 rounded-md">
            {currentSessionId ? (
              <>
                <ChatMessageList messages={messages} />
                <ChatInputForm onSendMessage={sendMessage} disabled={sending} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md text-center">
                  <h2 className="text-2xl font-bold mb-4">Bienvenue sur Chyll Assistant</h2>
                  <p className="mb-6 text-muted-foreground">
                    {sessions.length > 0 
                      ? "Sélectionnez une conversation existante ou démarrez-en une nouvelle."
                      : "Démarrez une nouvelle conversation pour interagir avec l'assistant."}
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
