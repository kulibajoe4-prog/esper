'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStructure } from '@/hooks/use-api';
import { fallbackData } from '@/lib/data';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const data01 = [
  { name: 'Present', value: 88, fill: 'hsl(var(--chart-1))' },
  { name: 'Absent', value: 12, fill: 'hsl(var(--destructive))' },
];

const data02 = [
  { name: 'Present', value: 82, fill: 'hsl(var(--chart-2))' },
  { name: 'Absent', value: 18, fill: 'hsl(var(--destructive))' },
];

export default function ComparativeAnalysis() {
  const { structure, loading } = useStructure();
  
  // Utiliser les données de l'API ou les données de fallback
  const entities = structure?.entities || fallbackData.departments;
  const faculties = entities.filter(entity => entity.level === 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparative Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <p className="font-medium">Selection 1</p>
            <Select defaultValue="Sciences et Technologies">
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder={loading ? "Loading..." : "Compare Faculty..."} />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.title}>
                    {faculty.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-lg font-bold">VS</div>
          <div className="flex flex-col items-center gap-2">
            <p className="font-medium">Selection 2</p>
            <Select defaultValue="Sciences Économiques et de Gestion">
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder={loading ? "Loading..." : "Compare Faculty..."} />
              </SelectTrigger>
              <SelectContent>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.title}>
                    {faculty.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold">
              Sciences et Technologies
            </h3>
            <ChartContainer config={{}} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data01}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data01.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="mb-4 text-lg font-semibold">
              Sciences Économiques
            </h3>
            <ChartContainer config={{}} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data02}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {data02.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}