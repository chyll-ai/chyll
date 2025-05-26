
import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Assistant from '@/pages/Assistant';
import LeadsTable from '@/components/dashboard/LeadsTable';
import { Loader2, GripVertical, MessageSquare, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AssistantService } from '@/services/assistant/index';
import { Lead } from '@/types/assistant';

const MIN_PANEL_WIDTH = 320;

const Dashboard = () => {
  const { session, isLoading: authLoading } = useAuth();
  const assistantServiceRef = useRef<AssistantService | null>(null);
  const isInitializedRef = useRef(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Resizable panel state
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState('35%');

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

  // Handle divider dragging
  useEffect(() => {
    const container = containerRef.current;
    const divider = dividerRef.current;
    if (!container || !divider) return;

    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.removeProperty('cursor');
      document.body.style.removeProperty('user-select');
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const containerRect = container.getBoundingClientRect();
      const newWidth = e.clientX - containerRect.left;
      
      const minPercentage = (MIN_PANEL_WIDTH / containerRect.width) * 100;
      const maxPercentage = 100 - minPercentage;
      const percentage = Math.min(Math.max((newWidth / containerRect.width) * 100, minPercentage), maxPercentage);
      
      setLeftPanelWidth(`${percentage}%`);
    };

    divider.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      divider.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

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
    <div className="h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
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
            </div>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 flex overflow-hidden min-h-0"
      >
        {/* Assistant Panel */}
        <div 
          style={{ width: leftPanelWidth, minWidth: MIN_PANEL_WIDTH }}
          className="h-full flex flex-col bg-background border-r border-border/60 shadow-sm overflow-hidden"
        >
          <div className="flex-shrink-0 px-4 py-3 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-lg">
                <MessageSquare className="h-3 w-3 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">AI Assistant</h2>
                <p className="text-xs text-muted-foreground">Ask me to find leads or help with prospects</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <Assistant embedded={true} assistantService={assistantServiceRef.current} />
          </div>
        </div>

        {/* Resizable Divider */}
        <div
          ref={dividerRef}
          className="w-1 bg-border/40 hover:bg-primary/20 cursor-col-resize flex items-center justify-center transition-all duration-200 group relative flex-shrink-0"
        >
          <div className="absolute inset-y-0 -inset-x-2 flex items-center justify-center">
            <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
          </div>
        </div>

        {/* Leads Panel */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden" style={{ minWidth: MIN_PANEL_WIDTH }}>
          <div className="flex-shrink-0 px-4 py-3 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-500/10 rounded-lg">
                <Users className="h-3 w-3 text-blue-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Recent Leads</h2>
                <p className="text-xs text-muted-foreground">Track and manage your prospects</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto p-4">
              <LeadsTable userId={session.user.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
