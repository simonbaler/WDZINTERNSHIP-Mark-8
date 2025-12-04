import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AccountSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground mt-2">Manage your account settings</p>
        <div className="mt-4 flex gap-2">
          <Button variant="outline">Change Password</Button>
          <Button variant="outline">Manage Preferences</Button>
        </div>
      </Card>
    </div>
  );
}
