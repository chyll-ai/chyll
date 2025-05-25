import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Assistant from '@/pages/Assistant';
import LeadsTable from '@/components/dashboard/LeadsTable';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { AssistantService } from '@/services/assistant/index';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { signOut, user, isLoading: authLoading } = useAuth();
  const assistantServiceRef = useRef<AssistantService | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user && !isInitializedRef.current) {
      setUserId(user.id);
      assistantServiceRef.current = new AssistantService(user.id);
      isInitializedRef.current = true;
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-border p-4 bg-background">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <Button variant="ghost" size="icon" onClick={signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <LeadsTable userId={user.id} />
        </main>
      </div>

      {/* Assistant */}
      <div className="w-[400px] border-l border-border">
        <Assistant 
          embedded={true} 
          assistantService={assistantServiceRef.current || undefined} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
