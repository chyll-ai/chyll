
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { ChatSession } from '@/components/chat/ChatSidebar';

export const useChatSessions = (userId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Charger toutes les sessions de chat
  const fetchSessions = useCallback(async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      console.log("Récupération des sessions pour l'utilisateur:", userId);
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log("Sessions récupérées:", data);
      setSessions(data || []);
    } catch (error) {
      console.error("Erreur lors de la récupération des sessions:", error);
      toast.error("Impossible de charger l'historique des conversations");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Créer une nouvelle session de chat
  const createSession = useCallback(async () => {
    if (!userId) return null;
    
    try {
      console.log("Création d'une nouvelle session...");
      
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          client_id: userId,
          title: null // Le titre sera mis à jour plus tard
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      console.log("Nouvelle session créée:", data);
      
      // Ajouter la nouvelle session à la liste et la définir comme session courante
      setSessions(prev => [data, ...prev]);
      setCurrentSessionId(data.id);
      
      return data.id;
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
      toast.error("Impossible de créer une nouvelle conversation");
      return null;
    }
  }, [userId]);

  // Mettre à jour le titre d'une session
  const updateSessionTitle = useCallback(async (sessionId: string, title: string) => {
    if (!userId || !sessionId) return;
    
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title })
        .eq('id', sessionId)
        .eq('client_id', userId);
      
      if (error) throw error;
      
      // Mettre à jour la liste des sessions
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? { ...session, title } 
            : session
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour du titre de la session:", error);
      // Ne pas afficher de toast pour ne pas perturber l'utilisateur
    }
  }, [userId]);

  // Initialisation
  useEffect(() => {
    if (userId) {
      fetchSessions();
      
      // Configurer l'écoute des modifications en temps réel
      const channel = supabase
        .channel('chat_sessions_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'chat_sessions',
            filter: `client_id=eq.${userId}`
          }, 
          (payload) => {
            console.log('Changement détecté dans les sessions:', payload);
            fetchSessions();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userId, fetchSessions]);

  return {
    sessions,
    loading,
    currentSessionId,
    setCurrentSessionId,
    createSession,
    updateSessionTitle,
    fetchSessions
  };
};

export default useChatSessions;
