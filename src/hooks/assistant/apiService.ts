import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';
import { Message, DatabaseMessage } from './types';

export const createThread = async () => {
  try {
    // Use the full URL for the Edge Function
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'
      },
      body: JSON.stringify({
        action: 'create_thread'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la création du thread');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la création du thread:", error);
    toast.error("Impossible de créer une conversation avec l'assistant");
    throw error;
  }
};

export const fetchMessages = async (userId: string): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('id, role, content, toolCalls, client_id, conversation_id, chat_session_id')
      .eq('client_id', userId)
      .order('id', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    // Type cast the data to ensure role is either 'user' or 'assistant'
    const typedMessages: Message[] = data?.map(msg => {
      // Explicitly type the database message
      const dbMessage = msg as DatabaseMessage;
      
      // Ensure role is one of the allowed values
      const role = (dbMessage.role === 'user' || dbMessage.role === 'assistant') 
        ? dbMessage.role as 'user' | 'assistant'
        : 'assistant'; // Default fallback
        
      // Create a properly typed Message object
      const message: Message = {
        id: dbMessage.id,
        role: role,
        content: dbMessage.content
      };
      
      // Only add toolCalls if they exist in the database message
      if (dbMessage.toolCalls) {
        message.toolCalls = Array.isArray(dbMessage.toolCalls) ? dbMessage.toolCalls : [];
      }
      
      return message;
    }) || [];
    
    console.log(`Fetched ${typedMessages.length} messages:`, typedMessages);
    return typedMessages;
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    toast.error("Impossible de charger les messages");
    return [];
  }
};

export const sendWelcomeMessage = async (userId: string, content: string, conversationId: string): Promise<Message | null> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        client_id: userId,
        role: 'assistant',
        content: content,
        conversation_id: conversationId,
        toolCalls: null
      }])
      .select('id, role, content, toolCalls, client_id, conversation_id, chat_session_id');
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      // Add the welcome message to the local state
      const welcomeMsg: Message = {
        id: data[0].id,
        role: 'assistant',
        content: content
        // Note: No toolCalls for welcome message
      };
      return welcomeMsg;
    }
    
    return null;
  } catch (error) {
    console.error("Erreur lors de l'envoi du message de bienvenue:", error);
    return null;
  }
};

export const sendMessageToOpenAI = async (threadId: string, content: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://atsfuqwxfrezkxtnctmk.supabase.co'}/functions/v1/openai-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0c2Z1cXd4ZnJlemt4dG5jdG1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjE3MjEsImV4cCI6MjA2MzIzNzcyMX0.FO6bvv2rFL0jhzN5aZ3m1QvNaM_ZNt7Ycmo859PSnJE'
      },
      body: JSON.stringify({
        action: 'send_message',
        threadId: threadId,
        message: content.trim()
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur de réponse de l'API OpenAI:", errorData);
      throw new Error(errorData.error || 'Erreur lors de l\'envoi du message');
    }
    
    const data = await response.json();
    console.log("Réponse reçue de l'API OpenAI:", data);
    return data;
  } catch (error) {
    console.error("Error sending message to OpenAI:", error);
    throw error;
  }
};

export const updateMessageWithToolCalls = async (messageId: string, toolCalls: any[]) => {
  try {
    // Use a custom RPC function that handles the updating of the toolCalls JSON field
    const params = {
      message_id: messageId,
      tool_calls: JSON.stringify(toolCalls)
    };
    
    const { error: updateError } = await supabase
      .rpc('update_message_toolcalls', params);
      
    if (updateError) {
      console.error("Error updating message with tool calls:", updateError);
      // Try direct update if RPC fails
      const { error: directUpdateError } = await supabase
        .from('messages')
        .update({ toolCalls: toolCalls })
        .eq('id', messageId);
      
      if (directUpdateError) {
        console.error("Error with direct update of toolCalls:", directUpdateError);
        throw directUpdateError;
      }
    }
  } catch (error) {
    console.error("Exception when updating toolCalls:", error);
    throw error;
  }
};
