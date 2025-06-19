
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Database, MessageSquare, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import WorkspaceAssistant from '@/components/workspace/WorkspaceAssistant';
import WorkspaceLeadTable from '@/components/workspace/WorkspaceLeadTable';
import { seedWorkspaceData } from '@/utils/seedWorkspaceData';
import { toast } from 'sonner';

const Workspace: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [seeding, setSeeding] = useState(false);

  const handleLeadsUpdate = () => {
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

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/10 overflow-hidden m-0 p-0">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border/60 bg-background/95 backdrop-blur-sm w-full m-0 p-0">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Chyll
                </span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Workspace CRM
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Advanced lead management workspace
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                AI Assistant Active
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleSeedData}
                  disabled={seeding}
                  className="hidden sm:flex"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Données test
                </Button>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Nouveau lead</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
            <WorkspaceAssistant onLeadsUpdate={handleLeadsUpdate} />
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
                <h2 className="text-sm font-semibold">Leads Management</h2>
                <p className="text-xs text-muted-foreground">Track and manage your prospects</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden m-0 p-0">
            <div className="h-full overflow-auto px-2 py-2">
              <WorkspaceLeadTable key={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workspace;
