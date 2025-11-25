import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GEMINI_CONFIG } from '@/config/api';

export default function AdminSettings() {
  const apiKeyMasked = useMemo(() => {
    const key = GEMINI_CONFIG.apiKey || '';
    if (!key) return 'Not configured';
    const visible = key.slice(0, 6);
    return `${visible}••••••••••••`;
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>AI Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-muted-foreground">Gemini Model</div>
          <div className="text-lg">{GEMINI_CONFIG.model}</div>
          <div className="text-sm text-muted-foreground mt-4">API Key</div>
          <div className="text-lg">{apiKeyMasked}</div>
          <div className="text-sm text-muted-foreground mt-4">Note</div>
          <div className="text-sm">Set `VITE_GEMINI_API_KEY` in your environment to enable AI features.</div>
        </CardContent>
      </Card>
    </div>
  );
}