/**
 * Page de gestion des présences
 */

import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import StudentSearch from '@/components/presence/student-search';
import { UserCheck } from 'lucide-react';

export default function PresencePage() {
  return (
    <DashboardLayout>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
        <SidebarTrigger className="sm:hidden" />
        <h1 className="text-2xl font-bold">Gestion des Présences</h1>
      </header>
      
      <main className="flex-1 space-y-6 p-4 pt-6 md:p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <UserCheck className="h-5 w-5" />
          <span>Enregistrez la présence des étudiants en temps réel</span>
        </div>
        
        <Separator />
        
        <StudentSearch />
      </main>
    </DashboardLayout>
  );
}