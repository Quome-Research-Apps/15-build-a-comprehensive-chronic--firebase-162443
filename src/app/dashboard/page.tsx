'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Download, Stethoscope, Pill, Activity } from 'lucide-react';
import { LogEntryDialog } from '@/components/dashboard/log-entry-dialog';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { EnvironmentalData } from '@/components/dashboard/environmental-data';
import type { LogEntry, SymptomLog, TreatmentLog, LifestyleLog } from '@/lib/types';
import { useToast } from "@/hooks/use-toast"

const initialLogEntries: LogEntry[] = [
  { id: '1', type: 'symptom', timestamp: new Date('2024-07-15T08:00:00Z'), name: 'Headache', severity: 7, notes: 'Woke up with it.' },
  { id: '2', type: 'lifestyle', timestamp: new Date('2024-07-15T22:00:00Z'), subtype: 'sleep', quality: 5, duration: 6 },
  { id: '3', type: 'symptom', timestamp: new Date('2024-07-16T09:00:00Z'), name: 'Headache', severity: 5, notes: 'Feeling a bit better.' },
  { id: '4', type: 'treatment', timestamp: new Date('2024-07-16T09:05:00Z'), name: 'Ibuprofen', dosage: '200mg', notes: 'Took with water' },
  { id: '5', type: 'lifestyle', timestamp: new Date('2024-07-16T22:30:00Z'), subtype: 'sleep', quality: 8, duration: 7.5 },
  { id: '6', type: 'symptom', timestamp: new Date('2024-07-17T08:30:00Z'), name: 'Headache', severity: 2, notes: 'Almost gone.' },
  { id: '7', type: 'lifestyle', timestamp: new Date('2024-07-17T13:00:00Z'), subtype: 'diet', item: 'Salad with chicken', notes: 'Light lunch'},
];

export default function Dashboard() {
  const [logEntries, setLogEntries] = useState<LogEntry[]>(initialLogEntries);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'symptom' | 'treatment' | 'lifestyle' | null>(null);
  const { toast } = useToast()
  
  const handleAddLog = (entry: Omit<SymptomLog, 'id' | 'type'> | Omit<TreatmentLog, 'id' | 'type'> | Omit<LifestyleLog, 'id' | 'type'>) => {
    const newEntry = {
      id: new Date().toISOString(),
      type: dialogType!,
      ...entry,
    } as LogEntry;
    setLogEntries(prev => [...prev, newEntry].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
    toast({
      title: "Entry Logged",
      description: `New ${dialogType} entry has been successfully added.`,
    })
  };

  const openDialog = (type: 'symptom' | 'treatment' | 'lifestyle') => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleExport = () => {
    if (logEntries.length === 0) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There is no data to export.",
      })
      return;
    }

    const headers = [
      'id', 'timestamp', 'type', 'name', 'severity', 'notes',
      'dosage', 'subtype', 'quality', 'duration', 'item',
      'exerciseType', 'exerciseDuration'
    ];
    const csvRows = [headers.join(',')];

    for (const entry of logEntries) {
        const row = {
            id: entry.id,
            timestamp: entry.timestamp.toISOString(),
            type: entry.type,
            name: 'name' in entry ? entry.name : '',
            severity: 'severity' in entry ? entry.severity : '',
            notes: 'notes' in entry ? entry.notes : '',
            dosage: 'dosage' in entry ? entry.dosage : '',
            subtype: 'subtype' in entry ? entry.subtype : '',
            quality: 'quality' in entry ? entry.quality : '',
            duration: 'duration' in entry ? entry.duration : '',
            item: 'item' in entry ? entry.item : '',
            exerciseType: 'exerciseType' in entry ? entry.exerciseType : '',
            exerciseDuration: 'exerciseDuration' in entry ? entry.exerciseDuration : ''
        };
        csvRows.push(headers.map(header => JSON.stringify(row[header as keyof typeof row] ?? '', (key, value) => value === null ? '' : value)).join(','));
    }

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `chronitrack_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
        title: "Export Successful",
        description: "Your data has been downloaded as a CSV file.",
    })
  };

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Log an Entry</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" onClick={() => openDialog('symptom')}><Stethoscope className="mr-2 h-4 w-4" /> Symptom</Button>
              <Button variant="outline" onClick={() => openDialog('treatment')}><Pill className="mr-2 h-4 w-4" /> Treatment</Button>
              <Button variant="outline" onClick={() => openDialog('lifestyle')}><Activity className="mr-2 h-4 w-4" /> Lifestyle</Button>
            </div>
          </CardContent>
        </Card>
        <EnvironmentalData />
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export Data</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">Download your complete data history as a CSV file.</p>
            <Button className="w-full" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Health Analytics</CardTitle>
            <CardDescription>Visualizing your health data over time. Correlate symptoms with lifestyle factors.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <AnalyticsChart data={logEntries} />
          </CardContent>
        </Card>
      </div>
      {dialogType && <LogEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        logType={dialogType}
        onLogSubmit={handleAddLog}
      />}
    </>
  );
}
