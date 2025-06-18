
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Users, Trophy, Search, Download, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/layout/Header';
import { Footer2 } from '@/components/ui/footer2';
import SuperadminGuard from '@/components/SuperadminGuard';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WaitlistEntry {
  id: string;
  email: string;
  referral_code: string;
  points: number;
  waitlist_position: number;
  referral_count: number;
  discord_joined: boolean;
  created_at: string;
}

const WaitlistManagement = () => {
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalEntries, setTotalEntries] = useState(0);

  const loadWaitlistEntries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('waitlist_with_position')
        .select('*')
        .order('waitlist_position', { ascending: true });

      if (error) {
        console.error('Error loading waitlist entries:', error);
        toast.error('Erreur lors du chargement de la liste d\'attente');
      } else {
        setWaitlistEntries(data || []);
        setTotalEntries(data?.length || 0);
      }
    } catch (error) {
      console.error('Error loading waitlist entries:', error);
      toast.error('Erreur lors du chargement de la liste d\'attente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWaitlistEntries();
  }, []);

  const filteredEntries = waitlistEntries.filter(entry =>
    entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.referral_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCsv = () => {
    const headers = ['Position', 'Email', 'Code de parrainage', 'Points', 'Parrainages', 'Discord', 'Date d\'inscription'];
    const csvContent = [
      headers.join(','),
      ...filteredEntries.map(entry => [
        entry.waitlist_position,
        entry.email,
        entry.referral_code,
        entry.points,
        entry.referral_count,
        entry.discord_joined ? 'Oui' : 'Non',
        new Date(entry.created_at).toLocaleDateString('fr-FR')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `waitlist_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPoints = waitlistEntries.reduce((sum, entry) => sum + entry.points, 0);
  const discordMembers = waitlistEntries.filter(entry => entry.discord_joined).length;

  return (
    <SuperadminGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        
        <div className="flex-1 bg-gradient-to-br from-background via-background to-muted/10">
          <div className="container-custom py-16">
            <div className="max-w-7xl mx-auto">
              {/* Back Link */}
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à l'accueil
              </Link>

              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">
                    Gestion de la <span className="rainbow-text-static">liste d'attente</span>
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Administrez les inscriptions et suivez les statistiques
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={loadWaitlistEntries} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                  <Button onClick={exportToCsv} disabled={filteredEntries.length === 0}>
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total inscriptions</p>
                        <p className="text-2xl font-bold">{totalEntries}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <Trophy className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Points totaux</p>
                        <p className="text-2xl font-bold">{totalPoints}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-full">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Membres Discord</p>
                        <p className="text-2xl font-bold">{discordMembers}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-full">
                        <Trophy className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Taux Discord</p>
                        <p className="text-2xl font-bold">
                          {totalEntries > 0 ? Math.round((discordMembers / totalEntries) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Filters */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Recherche et filtres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher par email ou code de parrainage..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Waitlist Table */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    Liste d'attente ({filteredEntries.length} entrées)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p>Chargement des données...</p>
                    </div>
                  ) : filteredEntries.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Aucune entrée trouvée</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Position</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Code de parrainage</TableHead>
                            <TableHead>Points</TableHead>
                            <TableHead>Parrainages</TableHead>
                            <TableHead>Discord</TableHead>
                            <TableHead>Date d'inscription</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEntries.map((entry) => (
                            <TableRow key={entry.id}>
                              <TableCell>
                                <Badge variant="outline">#{entry.waitlist_position}</Badge>
                              </TableCell>
                              <TableCell className="font-medium">{entry.email}</TableCell>
                              <TableCell>
                                <code className="bg-muted px-2 py-1 rounded text-sm">
                                  {entry.referral_code}
                                </code>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{entry.points} pts</Badge>
                              </TableCell>
                              <TableCell>{entry.referral_count}</TableCell>
                              <TableCell>
                                <Badge variant={entry.discord_joined ? "default" : "secondary"}>
                                  {entry.discord_joined ? "Rejoint" : "Non rejoint"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(entry.created_at).toLocaleDateString('fr-FR')}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <Footer2 />
      </div>
    </SuperadminGuard>
  );
};

export default WaitlistManagement;
