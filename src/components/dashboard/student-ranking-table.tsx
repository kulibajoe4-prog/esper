import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useStudents } from '@/hooks/use-api';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp } from 'lucide-react';

export default function StudentRankingTable() {
  const { students, loading, error } = useStudents({ limit: 20 });

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              <div className="h-4 w-64 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !students.length) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">
              {error || 'No student data available'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pour la démo, nous allons simuler des données de présence
  // En production, ces données viendraient de l'API des présences
  const studentsWithStats = students.map(student => ({
    ...student,
    attendance: Math.floor(Math.random() * 40) + 60, // 60-100%
    absences: Math.floor(Math.random() * 20), // 0-20 absences
  }));

  const mostAssiduous = [...studentsWithStats]
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 5);
  const mostAbsent = [...studentsWithStats]
    .sort((a, b) => b.absences - a.absences)
    .slice(0, 5);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUp className="h-5 w-5 text-green-500" />
            Most Assiduous Students
          </CardTitle>
          <CardDescription>
            Top 5 students with the highest attendance rate.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Promotion</TableHead>
                <TableHead className="text-right">Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mostAssiduous.map((student) => (
                <TableRow key={student.matricule}>
                  <TableCell className="font-medium">{student.fullname}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.promotion_label || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {student.attendance}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowDown className="h-5 w-5 text-red-500" />
            Most Absent Students
          </CardTitle>
          <CardDescription>
            Top 5 students with the most absences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Promotion</TableHead>
                <TableHead className="text-right">Absences</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mostAbsent.map((student) => (
                <TableRow key={student.matricule}>
                  <TableCell className="font-medium">{student.fullname}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.promotion_label || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {student.absences}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
