'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import type { LogEntry } from '@/lib/types';
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

interface AnalyticsChartProps {
  data: LogEntry[];
}

const chartConfig = {
  symptomSeverity: {
    label: "Symptom Severity",
    color: "hsl(var(--primary))",
  },
  sleepQuality: {
    label: "Sleep Quality",
    color: "hsl(var(--destructive))",
  },
} satisfies ChartConfig;

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  const chartData = useMemo(() => {
    const dataMap = new Map<string, { symptomSeverity?: number[]; sleepQuality?: number }>();

    data.forEach(entry => {
      const date = format(entry.timestamp, 'yyyy-MM-dd');
      if (!dataMap.has(date)) {
        dataMap.set(date, { symptomSeverity: [] });
      }
      const dayData = dataMap.get(date)!;

      if (entry.type === 'symptom' && typeof entry.severity === 'number') {
        dayData.symptomSeverity?.push(entry.severity);
      }
      if (entry.type === 'lifestyle' && entry.subtype === 'sleep' && typeof entry.quality === 'number') {
        dayData.sleepQuality = entry.quality;
      }
    });

    const sortedDates = Array.from(dataMap.keys()).sort((a,b) => parseISO(a).getTime() - parseISO(b).getTime());
    
    return sortedDates.map(date => {
      const dayData = dataMap.get(date)!;
      let avgSeverity;
      if (dayData.symptomSeverity && dayData.symptomSeverity.length > 0) {
        avgSeverity = dayData.symptomSeverity.reduce((a, b) => a + b, 0) / dayData.symptomSeverity.length;
      }
      
      return {
        date: format(parseISO(date), 'MMM d'),
        symptomSeverity: avgSeverity,
        sleepQuality: dayData.sleepQuality,
      };
    });
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8}
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))" 
            tickLine={false} 
            axisLine={false}
            tickMargin={8}
            fontSize={12} 
            domain={[0, 10]} 
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent
              indicator="line"
              labelClassName="text-sm"
              className="bg-background/95 backdrop-blur-sm"
            />}
          />
          <Legend />
          <Line 
            dataKey="symptomSeverity" 
            name="symptomSeverity" 
            type="monotone" 
            stroke={chartConfig.symptomSeverity.color} 
            strokeWidth={2} 
            dot={{ r: 4, fill: chartConfig.symptomSeverity.color }}
            activeDot={{ r: 6 }}
            connectNulls
          />
          <Line 
            dataKey="sleepQuality" 
            name="sleepQuality" 
            type="monotone" 
            stroke={chartConfig.sleepQuality.color} 
            strokeWidth={2}
            dot={{ r: 4, fill: chartConfig.sleepQuality.color }}
            activeDot={{ r: 6 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
