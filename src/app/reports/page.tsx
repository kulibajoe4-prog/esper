import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useStudents, useStructure } from '@/hooks/use-api';
import { fallbackData } from '@/lib/data';
import ReportsHeader from '@/components/reports/header';
import AttendanceByDepartmentChart from '@/components/reports/attendance-by-department-chart';
import TardinessByFacultyChart from '@/components/reports/tardiness-by-faculty-chart';

export default function ReportsPage() {
  const { students, loading: studentsLoading } = useStudents({ limit: 50 });
  const { structure, loading: structureLoading } = useStructure();
  
  const entities = structure?.entities || fallbackData.departments;
  const faculties = entities.filter(entity => entity.level === 1);

  return (
    <DashboardLayout>
      <ReportsHeader />
      <main className="flex-1 space-y-6 p-4 pt-6 md:p-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Rate by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <AttendanceByDepartmentChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tardiness Rate by Faculty</CardTitle>
            </CardHeader>
            <CardContent>
              <TardinessByFacultyChart />
            </CardContent>
          </Card>
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Faculty Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {faculties.map((faculty) => (
                  <li
                    key={faculty.id}
                    className="flex items-center justify-between"
                  >
                    <span>{faculty.title}</span>
                    <Badge variant="secondary">85%</Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <Card>
          <CardHeader>
            <CardTitle>Detailed Student Report</CardTitle>
          </CardHeader>
          <CardContent>
            {studentsLoading ? (
              <div className="space-y-3">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Promotion</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                  <TableHead className="text-right">Absences</TableHead>
                  <TableHead className="text-right">Tardiness</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.matricule}>
                    <TableCell className="font-medium">
                      {student.fullname}
                    </TableCell>
                    <TableCell>{student.entity_title || 'N/A'}</TableCell>
                    <TableCell>{student.promotion_label || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{student.promotion_label || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.floor(Math.random() * 40) + 60}%
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.floor(Math.random() * 20)}
                    </TableCell>
                    <TableCell className="text-right">
                      {Math.floor(Math.random() * 10)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </DashboardLayout>
  );
}
