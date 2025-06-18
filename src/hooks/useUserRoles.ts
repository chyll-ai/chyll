
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export type AppRole = 'superadmin' | 'admin' | 'user';

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export const useUserRoles = () => {
  const { user, isAuthenticated, sessionChecked } = useAuth();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSuperadminStatus = async () => {
    // Don't check if auth is still loading or user not authenticated
    if (!sessionChecked || !isAuthenticated || !user) {
      setIsSuperadmin(false);
      setLoading(false);
      return;
    }

    try {
      // Check if user is ceo@chyll.ai first (immediate check)
      const isCeo = user.email === 'ceo@chyll.ai';
      
      if (isCeo) {
        setIsSuperadmin(true);
        setLoading(false);
        // Ensure CEO has superadmin role in database (async, don't wait)
        ensureSuperadminRole().catch(console.error);
        return;
      }

      // For non-CEO users, check database role with timeout
      const checkRolePromise = supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'superadmin')
        .maybeSingle();

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      const { data, error } = await Promise.race([checkRolePromise, timeoutPromise]) as any;

      if (error && error.code !== 'PGRST116' && !error.message?.includes('Timeout')) {
        console.error('Error checking superadmin status:', error);
      }

      setIsSuperadmin(!!data);
    } catch (error) {
      console.error('Error checking superadmin status:', error);
      setIsSuperadmin(false);
    } finally {
      setLoading(false);
    }
  };

  const ensureSuperadminRole = async () => {
    if (!user || user.email !== 'ceo@chyll.ai') return;

    try {
      // Check if role already exists
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'superadmin')
        .maybeSingle();

      if (!existingRole) {
        // Insert superadmin role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'superadmin'
          });

        if (error) {
          console.error('Error creating superadmin role:', error);
        } else {
          console.log('Superadmin role created for ceo@chyll.ai');
        }
      }
    } catch (error) {
      console.error('Error ensuring superadmin role:', error);
    }
  };

  const loadUserRoles = async () => {
    if (!user || !isSuperadmin) return;

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading user roles:', error);
        toast.error('Erreur lors du chargement des rôles');
      } else {
        setUserRoles(data || []);
      }
    } catch (error) {
      console.error('Error loading user roles:', error);
      toast.error('Erreur lors du chargement des rôles');
    }
  };

  const assignRole = async (userId: string, role: AppRole) => {
    if (!isSuperadmin) {
      toast.error('Accès refusé');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role
        });

      if (error) {
        console.error('Error assigning role:', error);
        toast.error('Erreur lors de l\'attribution du rôle');
      } else {
        toast.success('Rôle attribué avec succès');
        await loadUserRoles();
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Erreur lors de l\'attribution du rôle');
    }
  };

  const removeRole = async (roleId: string) => {
    if (!isSuperadmin) {
      toast.error('Accès refusé');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', roleId);

      if (error) {
        console.error('Error removing role:', error);
        toast.error('Erreur lors de la suppression du rôle');
      } else {
        toast.success('Rôle supprimé avec succès');
        await loadUserRoles();
      }
    } catch (error) {
      console.error('Error removing role:', error);
      toast.error('Erreur lors de la suppression du rôle');
    }
  };

  useEffect(() => {
    // Only check when session is fully loaded
    if (sessionChecked) {
      checkSuperadminStatus();
    }
  }, [user, isAuthenticated, sessionChecked]);

  useEffect(() => {
    if (isSuperadmin && !loading) {
      loadUserRoles();
    }
  }, [isSuperadmin, loading]);

  return {
    userRoles,
    isSuperadmin,
    loading,
    assignRole,
    removeRole,
    loadUserRoles,
    checkSuperadminStatus
  };
};
