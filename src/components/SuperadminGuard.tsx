
import React from 'react';
import { useUserRoles } from '@/hooks/useUserRoles';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface SuperadminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const SuperadminGuard: React.FC<SuperadminGuardProps> = ({ children, fallback }) => {
  const { user, isAuthenticated } = useAuth();
  const { isSuperadmin, loading } = useUserRoles();

  // Show loading state while checking permissions
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Show login required if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
            <h1 className="text-2xl font-bold">Authentification requise</h1>
            <p className="text-muted-foreground">
              Vous devez être connecté pour accéder à cette page.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not superadmin
  if (!isSuperadmin) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Accès refusé</h1>
            <p className="text-muted-foreground">
              Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            </p>
            <p className="text-sm text-muted-foreground">
              Seuls les super-administrateurs peuvent accéder à cette fonctionnalité.
            </p>
            <Button asChild className="w-full">
              <Link to="/">Retour à l'accueil</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children if user is superadmin
  return <>{children}</>;
};

export default SuperadminGuard;
