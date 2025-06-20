
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Database, MessageSquare, Users, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import WorkspaceAssistant from '@/components/workspace/WorkspaceAssistant';
import WorkspaceLeadTable from '@/components/workspace/WorkspaceLeadTable';
import { seedWorkspaceData } from '@/utils/seedWorkspaceData';
import { toast } from 'sonner';

const Workspace: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [seeding, setSeeding] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLeadsUpdate = () => {
    console.log('Workspace: Triggering leads table refresh...');
    setRefreshKey(prev => prev + 1);
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await seedWorkspaceData();
      toast.success('Données de test ajoutées avec succès');
      handleLeadsUpdate();
    } catch (error) {
      toast.error('Erreur lors de l\'ajout des données de test');
    } finally {
      setSeeding(false);
    }
  };

  const AssistantPanel = () => (
    <div className="h-full flex flex-col bg-background border-r border-border/60 shadow-sm overflow-hidden">
      <div className="flex-shrink-0 px-3 py-3 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 bg-primary/10 rounded-lg">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold truncate">AI Assistant</h2>
            <p className="text-xs text-muted-foreground truncate">Ask me to find leads or help with prospects</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <WorkspaceAssistant onLeadsUpdate={handleLeadsUpdate} />
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/60 bg-background/95 backdrop-blur-sm">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and title */}
            <div className="flex items-center gap-3 min-w-0">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <AssistantPanel />
                </SheetContent>
              </Sheet>
              
              <Link 
                to="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Chyll
                </span>
              </Link>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <div className="hidden sm:block min-w-0">
                <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent truncate">
                  Workspace CRM
                </h1>
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  Advanced lead management workspace
                </p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-base font-bold truncate">Workspace</h1>
              </div>
            </div>
            
            {/* Right side - Status and actions */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
              <div className="hidden md:flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                <span className="hidden lg:inline">AI Assistant Active</span>
                <span className="lg:hidden">AI Active</span>
              </div>
              <div className="flex gap-1 sm:gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleSeedData}
                  disabled={seeding}
                  className="h-8 px-2 sm:px-3"
                >
                  <Database className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Données test</span>
                </Button>
                <Button size="sm" variant="outline" className="h-8 px-2 sm:px-3">
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Nouveau lead</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Desktop Assistant Panel */}
        <div className="hidden lg:block w-80 xl:w-96 h-full">
          <AssistantPanel />
        </div>

        {/* Leads Panel */}
        <div className="flex-1 flex flex-col bg-background overflow-hidden min-w-0">
          <div className="flex-shrink-0 px-3 py-3 border-b border-border/40 bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 bg-blue-500/10 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold truncate">Leads Management</h2>
                <p className="text-xs text-muted-foreground truncate">Track and manage your prospects</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto p-2 sm:p-3">
              <WorkspaceLeadTable key={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
