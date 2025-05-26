import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Assistant from '@/pages/Assistant';
import LeadsTable from '@/components/dashboard/LeadsTable';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AssistantService } from '@/services/assistant/index';
import { Lead } from '@/types/assistant';

const Dashboard = () => {
  const { session, isLoading: authLoading } = useAuth();
  const assistantServiceRef = useRef<AssistantService | null>(null);
  const isInitializedRef = useRef(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (session?.user && !isInitializedRef.current) {
      assistantServiceRef.current = new AssistantService(session.user.id);
      
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
  }, [session]);

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session?.user) {
    return <Navigate to="/login" replace state={{ from: '/dashboard' }} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-6">
        {/* Assistant Section */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-2xl font-bold">AI Assistant</h2>
          <Assistant />
        </section>

        {/* Leads Section */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-2xl font-bold">Recent Leads</h2>
          <LeadsTable userId={session.user.id} />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
