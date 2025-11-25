import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, CheckCircle, XCircle, RefreshCw, Database, HardDrive } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface HealthCheck {
  status: string;
  checks: {
    database: boolean;
    storage: boolean;
    timestamp: string;
  };
  version?: string;
}

export default function Monitoring() {
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [loading, setLoading] = useState(false);

  const checkHealth = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('health-check');
      
      if (error) throw error;
      
      setHealth(data);
      
      if (data.status === 'healthy') {
        toast.success('All systems operational');
      } else {
        toast.warning('Some systems degraded');
      }
    } catch (error: any) {
      toast.error('Health check failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Monitoring</h1>
          <p className="text-muted-foreground">Real-time health checks and system status</p>
        </div>
        <Button onClick={checkHealth} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {health && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Overall Status
              </CardTitle>
              <CardDescription>
                Last checked: {new Date(health.checks.timestamp).toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                {health.status === 'healthy' ? (
                  <>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-xl font-semibold">All Systems Operational</p>
                      <p className="text-sm text-muted-foreground">
                        Version {health.version || '1.0.0'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-xl font-semibold">Degraded Performance</p>
                      <p className="text-sm text-muted-foreground">Some services unavailable</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {health.checks.database ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Healthy
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Unavailable
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {health.checks.storage ? (
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Healthy
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <XCircle className="h-3 w-3 mr-1" />
                      Unavailable
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
