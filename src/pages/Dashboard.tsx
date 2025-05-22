
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Assistant from '@/pages/Assistant';
import LeadsTable from '@/components/dashboard/LeadsTable';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Check if user has a profile, otherwise redirect to assistant page
  useEffect(() => {
    const checkUserProfile = async () => {
      try {
        // Get the current user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError || !userData.user) {
          console.error("No user found:", userError);
          navigate('/login');
          return;
        }
        
        const userId = userData.user.id;
        setUserId(userId);
        
        // Check if user has a profile
        const { data: profileData, error: profileError } = await supabase
          .from('client_profile')
          .select('*')
          .eq('client_id', userId)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error retrieving profile:", profileError);
          throw new Error("Error retrieving profile");
        }
        
        const profileExists = !!profileData;
        setHasProfile(profileExists);
        
        // If no profile exists, redirect to assistant page
        if (!profileExists) {
          navigate('/assistant');
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading profile data:", error);
        setLoading(false);
      }
    };
    
    checkUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background">
      {/* Assistant Chat Column (40%) */}
      <div className="w-full md:w-2/5 h-full border-r border-border">
        <Assistant embedded={true} />
      </div>
      
      {/* Leads Table Column (60%) */}
      <div className="w-full md:w-3/5 h-full overflow-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Leads</h1>
        {userId && <LeadsTable userId={userId} />}
      </div>
    </div>
  );
};

export default Dashboard;
