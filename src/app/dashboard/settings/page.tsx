import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="h-6 w-6" /> Settings</CardTitle>
        <CardDescription>
          This is where you will be able to manage your account and application preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold">Feature Under Construction</h3>
            <p className="text-muted-foreground">Account and preference settings will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
