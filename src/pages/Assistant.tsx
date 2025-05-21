
import React, { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useAssistantChat, { handleFunctionCall } from '@/hooks/useAssistantChat';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessageList from '@/components/chat/ChatMessageList';
import ChatInputForm from '@/components/chat/ChatInputForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const Assistant = () => {
  const {
    loading,
    sending,
    messages,
    sendMessage,
    threadId,
    currentRunId,
    userId,
    hasProfile
  } = useAssistantChat();
  
  const location = useLocation();
  
  // Handle OAuth code returned from Gmail with improved error handling
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      // Clean URL by removing the query parameters
      window.history.replaceState({}, document.title, location.pathname);
      
      if (code && state && userId) {
        try {
          toast.info("Finalizing Gmail connection...");
          
          // Exchange the code for tokens
          const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/connect-gmail`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify({
              action: 'exchange_code',
              code: code,
              client_id: userId,
              redirect_url: window.location.origin + '/assistant' // Ensure redirect URL matches exactly what's configured in Google
            })
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
              errorData = JSON.parse(errorText);
            } catch (e) {
              errorData = { error: errorText };
            }
            console.error("Error exchanging code:", errorData);
            
            // More descriptive error messages for users
            if (errorData.error?.includes("invalid_grant")) {
              toast.error("Gmail authorization expired. Please try connecting again.");
            } else {
              toast.error("Error connecting to Gmail. Please try again.");
            }
            return;
          }
          
          const result = await response.json();
          console.log("Gmail connection successful:", result);
          toast.success("Gmail connected successfully!");
          
          // Send a message to the assistant to let it know the connection was successful
          if (result.access_token) {
            setTimeout(() => {
              sendMessage("I've successfully connected my Gmail account. Now you can send emails on my behalf.");
            }, 500);
          }
        } catch (error) {
          console.error("Error processing OAuth callback:", error);
          toast.error("Error connecting to Gmail. Please check console for details.");
        }
      }
    };
    
    handleOAuthCallback();
  }, [location, userId, sendMessage]);
  
  // Handle any tool calls from the assistant
  const processToolCalls = useCallback((toolCalls) => {
    if (!toolCalls || !Array.isArray(toolCalls)) return;
    
    console.log("Processing tool calls:", toolCalls);
    
    toolCalls.forEach(toolCall => {
      if (toolCall.type === 'function' && threadId && currentRunId) {
        if (toolCall.function?.name === 'connect_gmail') {
          console.log("Gmail connection tool call detected, processing...");
          handleFunctionCall(toolCall, threadId, currentRunId);
        } else if (toolCall.function?.name === 'send_gmail_email') {
          console.log("Gmail send email tool call detected, processing...");
          handleFunctionCall(toolCall, threadId, currentRunId);
        } else {
          console.log("Unknown or unhandled tool call:", toolCall);
        }
      }
    });
  }, [threadId, currentRunId]);
  
  // Check if profile is missing and guide the user instead of redirecting
  useEffect(() => {
    if (hasProfile === false && !loading && messages.length === 0) {
      // User is logged in but doesn't have a profile, guide them to use the assistant
      setTimeout(() => {
        sendMessage("Hello! I notice you don't have a profile yet. To get the most out of our assistant, let me ask you a few questions about your business and target audience. This will help me provide more personalized assistance. What is your company name?");
      }, 1000);
    }
  }, [hasProfile, loading, sendMessage, messages.length]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-background">
      <ChatHeader />
      <ChatMessageList messages={messages} onProcessToolCalls={processToolCalls} />
      <ChatInputForm onSendMessage={sendMessage} disabled={sending} />
    </div>
  );
};

export default Assistant;
