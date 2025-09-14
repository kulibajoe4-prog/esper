"use client";

import { useState } from 'react';
import { generateExecutiveSummary } from '@/ai/flows/generate-executive-summary';
import { detectAttendanceAnomalies } from '@/ai/flows/attendance-anomaly-detection';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader, Sparkles, AlertTriangle } from 'lucide-react';
import { usePresences } from '@/hooks/use-api';
import { useToast } from '@/hooks/use-toast';

export default function InsightIdentification() {
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [anomalies, setAnomalies] = useState('');
  const [anomaliesLoading, setAnomaliesLoading] = useState(false);
  const { toast } = useToast();
  const { presences } = usePresences({ limit: 100 });

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    setSummary('');
    try {
      const result = await generateExecutiveSummary({
        faculty: 'All',
        department: 'All',
        promotion: 'All',
        startDate: '2023-09-01',
        endDate: '2023-10-01',
      });
      setSummary(result.summary);
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not generate the executive summary.',
      });
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleDetectAnomalies = async () => {
    setAnomaliesLoading(true);
    setAnomalies('');
    try {
      const result = await detectAttendanceAnomalies({
        attendanceData: JSON.stringify(presences),
      });
      setAnomalies(result.anomalies);
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not detect attendance anomalies.',
      });
    } finally {
      setAnomaliesLoading(false);
    }
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI-Powered Insights
        </CardTitle>
        <CardDescription>
          Automatically generate summaries and detect anomalies in attendance
          data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col gap-4">
        <div className="flex-grow space-y-2">
          <Button
            onClick={handleGenerateSummary}
            disabled={summaryLoading}
            className="w-full"
          >
            {summaryLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Generate Executive Summary
          </Button>
          {summary && (
            <Alert>
              <AlertTitle>Executive Summary</AlertTitle>
              <AlertDescription className="text-sm">{summary}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex-grow space-y-2">
          <Button
            onClick={handleDetectAnomalies}
            disabled={anomaliesLoading}
            className="w-full"
            variant="secondary"
          >
            {anomaliesLoading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Detect Attendance Anomalies
          </Button>
          {anomalies && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Anomalies Detected</AlertTitle>
              <AlertDescription>{anomalies}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
