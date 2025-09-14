'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { useStats } from '@/hooks/use-api';
import {
  ChartTooltipContent,
  ChartTooltip,
  ChartContainer,
} from '@/components/ui/chart';

export default function PresenceOverviewChart() {
  const { stats, loading, error } = useStats();

  if (loading) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading chart data...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="h-[350px] w-full flex items-center justify-center">
        <div className="text-sm text-muted-foreground">
          {error || 'Unable to load chart data'}
        </div>
      </div>
    );
  }

  const chartData = stats.by_promotion.map((item) => ({
    name: item.promotion.split(' ').slice(0, 2).join(' '), // Shorten name for chart
    Taux: item.total_presences > 0 
      ? Math.round((item.on_time_count / item.total_presences) * 100)
      : 0,
    Retards: item.late_count,
  }));

  const chartConfig = {
    Taux: {
      label: 'Attendance Rate',
      color: 'hsl(var(--primary))',
    },
    Retards: {
      label: 'Late Arrivals',
      color: 'hsl(var(--destructive))',
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            content={<ChartTooltipContent />}
            cursor={{ fill: 'hsl(var(--muted))' }}
          />
          <Legend />
          <Bar
            dataKey="Taux"
            fill="var(--color-Taux)"
            radius={[4, 4, 0, 0]}
            name="Attendance Rate"
          />
          <Bar
            dataKey="Retards"
            fill="var(--color-Retards)"
            radius={[4, 4, 0, 0]}
            name="Late Arrivals"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}