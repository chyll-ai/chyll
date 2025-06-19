
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Database } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Header - Fixed */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Retour au dashboard</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-xl lg:text-2xl font-bold">Workspace CRM</h1>
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
      </header>

      {/* Main Content - Grid Layout */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Lead Table - Takes 3/4 of space on xl screens, full width on smaller screens */}
          <div className="xl:col-span-3 order-2 xl:order-1">
            <WorkspaceLeadTable key={refreshKey} />
          </div>

          {/* Assistant - Takes 1/4 of space on xl screens, full width on smaller screens */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="sticky top-24">
              <WorkspaceAssistant onLeadsUpdate={handleLeadsUpdate} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workspace;
