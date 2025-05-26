
import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Assistant from '@/pages/Assistant';
import LeadsTable from '@/components/dashboard/LeadsTable';
import { Loader2, GripVertical } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AssistantService } from '@/services/assistant/index';
import { Lead } from '@/types/assistant';

const MIN_PANEL_WIDTH = 300;

const Dashboard = () => {
  const { session, isLoading: authLoading } = useAuth();
  const assistantServiceRef = useRef<AssistantService | null>(null);
  const isInitializedRef = useRef(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Resizable panel state
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState('30%');

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
    <div className="h-screen flex flex-col bg-background">
      <div 
        ref={containerRef}
        className="flex-1 flex overflow-hidden"
      >
        <div 
          style={{ width: leftPanelWidth }}
          className="h-full flex flex-col min-w-[300px] border-r border-border"
        >
          <div className="p-4 border-b border-border">
            <h2 className="text-2xl font-bold">AI Assistant</h2>
          </div>
          <div className="flex-1 overflow-hidden">
            <Assistant embedded={true} assistantService={assistantServiceRef.current} />
          </div>
        </div>

        <div
          ref={dividerRef}
          className="w-2 bg-border hover:bg-primary/10 cursor-col-resize flex items-center justify-center transition-colors"
        >
          <GripVertical className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="flex-1 flex flex-col min-w-[300px] overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-2xl font-bold">Recent Leads</h2>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <LeadsTable userId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
