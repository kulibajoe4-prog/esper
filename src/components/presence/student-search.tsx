/**
 * Composant de recherche d'étudiant pour marquer la présence
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStudentSearch, useMarkPresence } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';
import { Search, UserCheck, Clock, MapPin, Calendar } from 'lucide-react';

export default function StudentSearch() {
  const [matricule, setMatricule] = useState('');
  const { student, loading: searchLoading, error, searchStudent, clearStudent } = useStudentSearch();
  const { markPresence, loading: markingLoading } = useMarkPresence();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matricule.trim()) return;

    try {
      await searchStudent(matricule.trim());
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  const handleMarkPresence = async () => {
    if (!student) return;

    try {
      const result = await markPresence({
        matricule: student.matricule,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0],
      });

      toast({
        title: 'Présence enregistrée',
        description: `${student.fullname} - ${result.status === 'on_time' ? 'À l\'heure' : 'En retard'}`,
      });

      // Clear the form
      setMatricule('');
      clearStudent();
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: err instanceof Error ? err.message : 'Impossible d\'enregistrer la présence',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Rechercher un étudiant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Entrez le matricule (ex: 05/23.07433)"
              value={matricule}
              onChange={(e) => setMatricule(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={searchLoading || !matricule.trim()}>
              {searchLoading ? 'Recherche...' : 'Rechercher'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {student && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Informations de l'étudiant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={student.avatar} alt={student.fullname} />
                <AvatarFallback>
                  {student.fullname.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-lg font-semibold">{student.fullname}</h3>
                  <p className="text-sm text-muted-foreground">Matricule: {student.matricule}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Né(e) le {new Date(student.birthday).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{student.birthplace}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{student.promotion_label || 'N/A'}</Badge>
                  <Badge variant={student.active ? 'default' : 'secondary'}>
                    {student.active ? 'Actif' : 'Inactif'}
                  </Badge>
                  <Badge variant="outline">{student.civilStatus}</Badge>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleMarkPresence}
                    disabled={markingLoading || !student.active}
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    {markingLoading ? 'Enregistrement...' : 'Marquer présent'}
                  </Button>
                  <Button variant="outline" onClick={clearStudent}>
                    Nouveau
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}