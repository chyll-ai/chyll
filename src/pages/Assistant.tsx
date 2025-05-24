import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAssistantChat from '@/hooks/assistant/useAssistantChat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInputForm from '@/components/chat/ChatInputForm';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useGmailAuth } from '@/hooks/useGmailAuth';
import { useOAuthHandler } from '@/hooks/useOAuthHandler';
import { Button } from '@/components/ui/button';
import { Mail, LogIn, RefreshCw } from 'lucide-react';
import { debugStorage } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/lib/supabase';

interface AssistantProps {
  embedded?: boolean;
}

const Assistant = ({ embedded = false }: AssistantProps) => {
  const navigate = useNavigate();
  const {
    loading: chatLoading,
    sending,
    isGenerating,
    messages,
    sendMessage,
    conversationId,
  } = useAssistantChat();

  const { user, session, isLoading: authLoading } = useAuth();
  const { isConnected, isChecking, checkConnection } = useGmailAuth();
  const { oauthInProgress } = useOAuthHandler();

  useEffect(() => {
    const checkAuthState = async () => {
      console.log('Checking auth state on Assistant page...');
      debugStorage();
      
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      console.log('Current session state:', {
        exists: !!currentSession,
        userId: currentSession?.user?.id,
        expiresAt: currentSession?.expires_at
      });
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        return;
      }
      
      if (!currentSession) {
        console.log('No active session found, redirecting to login...');
        navigate('/login');
      }
    };
    
    checkAuthState();
  }, [navigate]);

  const handleGoToLogin = useCallback(() => {
    console.log('Redirecting to login page...');
    navigate('/login');
  }, [navigate]);

  const handleConnectGmail = useCallback(async () => {
    if (!user?.id || !session?.access_token) {
      console.log('Cannot connect Gmail - missing user or session:', {
        userId: user?.id,
        hasAccessToken: !!session?.access_token
      });
      toast.error('Please log in first');
      return;
    }

    try {
      console.log('Initiating Gmail OAuth...', {
        userId: user.id,
        redirectUrl: `${window.location.origin}/assistant`
      });
      
      // Get OAuth URL from our existing Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/connect-gmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY
        },
        body: JSON.stringify({
          action: 'connect',
          redirect_url: `${window.location.origin}/assistant`
        })
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('Failed to get OAuth URL:', result);
        throw new Error(result.error || 'Failed to initiate Gmail connection');
      }

      const result = await response.json();
      console.log('Received OAuth response:', result);
      
      if (result.oauth_url) {
        console.log('Redirecting to Google OAuth URL...');
        window.location.href = result.oauth_url;
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Failed to connect Gmail:', error);
      toast.error(error.message || 'Failed to connect Gmail');
    }
  }, [user, session]);

  const handleRefreshGmailConnection = useCallback(async () => {
    if (user?.id) {
      console.log('Refreshing Gmail connection for user:', user.id);
      await checkConnection(user.id);
    } else {
      console.log('Cannot refresh Gmail connection - no user ID');
    }
  }, [user, checkConnection]);

  // Debug function to check auth state
  const handleDebugAuth = useCallback(async () => {
    console.group('[Auth Debug]');
    console.log('User:', user);
    console.log('Session:', session);
    console.log('User ID:', user?.id);
    console.log('Session Access Token:', session?.access_token ? 'Present' : 'Missing');
    console.log('Session Expires At:', session?.expires_at);
    console.log('Auth Loading:', authLoading);
    console.log('Gmail Connected:', isConnected);
    
    // Check current session
    const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
    console.log('Current session check:', {
      exists: !!currentSession,
      error: sessionError,
      userId: currentSession?.user?.id,
      expiresAt: currentSession?.expires_at
    });
    
    console.groupEnd();
    debugStorage();
  }, [user, session, authLoading, isConnected]);

  // Check Gmail connection when user becomes available
  useEffect(() => {
    if (user?.id && !isChecking) {
      console.log('Checking Gmail connection for user:', user.id);
      checkConnection(user.id);
    }
  }, [user?.id, checkConnection, isChecking]);

  // Show loading state while checking auth
  if (authLoading) {
    console.log('Auth loading state...');
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user || !session) {
    console.log('No authenticated user found');
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="mb-6">
            <LogIn className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Authentication Required</h1>
            <p className="text-muted-foreground">
              Sign in with Google to access the assistant.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button onClick={handleGoToLogin} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
            
            {/* Debug section for unauthenticated users */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="text-sm">
                <p className="font-medium mb-2">Debug Info:</p>
                <Button size="sm" variant="outline" onClick={handleDebugAuth} className="mb-2">
                  Check Auth State
                </Button>
                <div className="text-xs text-muted-foreground">
                  User: {user ? '✓' : '✗'} | 
                  Session: {session ? '✓' : '✗'} | 
                  Loading: {authLoading ? '✓' : '✗'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state only for initial chat load
  const isInitialLoading = chatLoading && !messages.length;

  if (isInitialLoading) {
    console.log('Initial chat loading state...');
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading your chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {!embedded && (
        <ChatHeader 
          conversationId={conversationId}
          showBackButton={true}
        />
      )}
      
      {/* Status section */}
      <div className="p-4 bg-gray-100 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Status:</span>
            <span className="text-xs">
              User: {user ? '✓' : '✗'} | 
              Session: {session ? '✓' : '✗'} |
              Gmail: {isConnected ? '✓' : '✗'}
            </span>
            {!isConnected && (
              <span className="text-xs text-orange-600">
                Connect Gmail to send emails
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={handleDebugAuth}>
              Debug
            </Button>
            
            {!isConnected && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleConnectGmail}
                disabled={oauthInProgress || !session}
              >
                <Mail className="mr-2 h-4 w-4" />
                Connect Gmail
              </Button>
            )}
            
            {isConnected && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleRefreshGmailConnection}
                disabled={isChecking}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <ChatMessageList 
          messages={messages} 
          isGenerating={isGenerating}
        />
      </div>

      <ChatInputForm 
        onSubmit={sendMessage} 
        disabled={sending || isGenerating} 
        loading={sending}
      />
    </div>
  );
};

export default Assistant;
