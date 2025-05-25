import React, { useEffect, useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import Assistant from '@/pages/Assistant';
import LeadsTable from '@/components/dashboard/LeadsTable';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { AssistantService } from '@/services/assistant/index';
import { Lead } from '@/types/assistant';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const { signOut, user, isLoading: authLoading } = useAuth();
  const assistantServiceRef = useRef<AssistantService | null>(null);
  const isInitializedRef = useRef(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (user && !isInitializedRef.current) {
      setUserId(user.id);
      assistantServiceRef.current = new AssistantService(user.id);
      
      // Set up the leads update callback
      assistantServiceRef.current.setLeadsUpdateCallback((newLeads) => {
        console.log('Dashboard: Received new leads from AssistantService:', newLeads);
        setLeads(currentLeads => {
          const updatedLeads = [...newLeads, ...currentLeads];
          console.log('Dashboard: Updated leads state:', updatedLeads);
          return updatedLeads;
        });
      });
      
      isInitializedRef.current = true;
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
      <LeadsTable userId={user.id} />
    </div>
  );
};

export default Dashboard;
