
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
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Retour au dashboard</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-bold">Workspace CRM</h1>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleSeedData}
                disabled={seeding}
              >
                <Database className="h-4 w-4 mr-2" />
                Ajouter données test
              </Button>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau lead
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
          {/* Colonne gauche : Assistant IA */}
          <div className="lg:max-w-none">
            <WorkspaceAssistant onLeadsUpdate={handleLeadsUpdate} />
          </div>

          {/* Colonne droite : Tableau des leads */}
          <div className="lg:max-w-none">
            <WorkspaceLeadTable key={refreshKey} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Workspace;
