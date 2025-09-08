'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Thermometer, Wind, Loader2, Compass } from 'lucide-react';
import { fetchEnvironmentalDataAction } from '@/lib/actions';
import type { EnvironmentalDataOutput } from '@/ai/flows/environmental-data-integration';
import { Skeleton } from '@/components/ui/skeleton';

export function EnvironmentalData() {
  const [location, setLocation] = useState('New York');
  const [data, setData] = useState<EnvironmentalDataOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (loc: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    const result = await fetchEnvironmentalDataAction(loc);
    if (result.data) {
      setData(result.data);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }
    setLoading(false);
  };
  
  useEffect(() => {
    fetchData('New York');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(location);
  };

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-muted-foreground"/>
            <CardTitle>Environmental Factors</CardTitle>
        </div>
        <CardDescription>Local weather and air quality for the selected location.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
          <Input 
            placeholder="Enter a city" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Fetch'}
          </Button>
        </form>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading && (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                 <div className="flex items-start gap-2">
                     <Skeleton className="h-5 w-5 mt-0.5 rounded-full" />
                     <div>
                         <Skeleton className="h-5 w-20 mb-1" />
                         <Skeleton className="h-4 w-40" />
                     </div>
                 </div>
                 <div className="flex items-start gap-2">
                     <Skeleton className="h-5 w-5 mt-0.5 rounded-full" />
                     <div>
                         <Skeleton className="h-5 w-24 mb-1" />
                         <Skeleton className="h-4 w-36" />
                     </div>
                 </div>
             </div>
        )}
        {data && !loading &&(
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Thermometer className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-semibold">Weather</p>
                <p className="text-muted-foreground">{data.weather}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Wind className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-semibold">Air Quality</p>
                <p className="text-muted-foreground">{data.airQuality}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
