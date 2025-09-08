import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><LineChart className="h-6 w-6" /> Advanced Analytics</CardTitle>
        <CardDescription>
          This is where more in-depth analytics and automatic correlation detection will be displayed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold">Feature Under Construction</h3>
            <p className="text-muted-foreground">Come back soon to discover powerful insights about your health data!</p>
        </div>
      </CardContent>
    </Card>
  );
}
