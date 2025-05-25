import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Assistant from '@/pages/Assistant';
import LeadsTable from '@/components/dashboard/LeadsTable';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { signOut, user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    console.log('Dashboard: Auth state changed', { 
      user: !!user, 
      authLoading
    });

    if (!authLoading && !user) {
      console.log('Dashboard: No user, redirecting to login');
      navigate('/login');
      return;
    }

    if (user) {
      console.log('Dashboard: Setting userId', user.id);
      setUserId(user.id);
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    console.log('Dashboard: Loading state');
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    console.log('Dashboard: User check failed');
    return null;
  }

  console.log('Dashboard: Rendering main dashboard');

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Dashboard Header */}
      <div className="w-full border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          variant="outline"
          onClick={signOut}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 md:flex-row h-[calc(100vh-73px)]">
        {/* Assistant Chat Column (40%) */}
        <div className="w-full md:w-2/5 h-full border-r border-border">
          <Assistant embedded={true} />
        </div>
        
        {/* Leads Table Column (60%) */}
        <div className="w-full md:w-3/5 h-full overflow-auto p-4">
          <h2 className="text-xl font-semibold mb-4">Leads</h2>
          {userId && <LeadsTable userId={userId} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
