
import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Assistant from '@/pages/Assistant';
import LeadsTable from '@/components/dashboard/LeadsTable';
import ConnectionDebugger from '@/components/dashboard/ConnectionDebugger';
import { Loader2, MessageSquare, Users, Info, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AssistantService } from '@/services/assistant/index';
import { Lead } from '@/types/assistant';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Dashboard = () => {
  const { session, isLoading: authLoading } = useAuth();
  const assistantServiceRef = useRef<AssistantService | null>(null);
  const isInitializedRef = useRef(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showDebugger, setShowDebugger] = useState(false);

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
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background to-muted/30">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Loading Dashboard</h3>
            <p className="text-sm text-muted-foreground">Setting up your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session?.user) {
    return <Navigate to="/login" replace state={{ from: '/dashboard' }} />;
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10 overflow-hidden m-0 p-0">
      {/* Demo Notice */}
      <div className="flex-shrink-0 w-full m-0 p-0">
        <Card className="border-orange-200 bg-orange-50 m-2 mb-0">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-orange-500/10 rounded">
                <Info className="h-3 w-3 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800">
                  Ceci est une démo - Le produit final sera lancé mi-juin et nous vous contacterons
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/60 bg-background/95 backdrop-blur-sm w-full m-0 p-0">
        <div className="w-full px-2 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Manage your leads and AI assistant
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                AI Assistant Active
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDebugger(!showDebugger)}
                className="h-6 px-2"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      {showDebugger && (
        <div className="flex-shrink-0 border-b border-border/40 bg-muted/20 px-2 py-2">
          <ConnectionDebugger userId={session.user.id} />
        </div>
      )}

      <div className="flex-1 flex overflow-hidden min-h-0 w-full m-0 p-0">
        {/* Assistant Panel */}
        <div className="w-[25%] h-full flex flex-col bg-background border-r border-border/60 shadow-sm overflow-hidden m-0 p-0">
          <div className="flex-shrink-0 px-2 py-2 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-primary/10 rounded-lg">
                <MessageSquare className="h-3 w-3 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">AI Assistant</h2>
                <p className="text-xs text-muted-foreground">Ask me to find leads or help with prospects</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden m-0 p-0">
            <Assistant embedded={true} assistantService={assistantServiceRef.current} />
          </div>
        </div>

        {/* Leads Panel */}
        <div className="w-[75%] flex flex-col bg-background overflow-hidden m-0 p-0">
          <div className="flex-shrink-0 px-2 py-2 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 bg-blue-500/10 rounded-lg">
                <Users className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Recent Leads</h2>
                <p className="text-xs text-muted-foreground">Track and manage your prospects</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden m-0 p-0">
            <div className="h-full overflow-auto px-2 py-2">
              <LeadsTable userId={session.user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
