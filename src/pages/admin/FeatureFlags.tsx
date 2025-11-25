import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Shield, AlertTriangle, Lock, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FeatureFlag {
  id: string;
  flag_key: string;
  is_enabled: boolean;
  description: string | null;
  requires_auth: boolean;
  security_notes: string | null;
  metadata: any;
}

export default function FeatureFlags() {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadFlags();
    }
  }, [isAdmin]);

  const loadFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .order('flag_key');

      if (error) throw error;
      setFlags(data || []);
    } catch (error) {
      toast({
        title: 'Error loading flags',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFlag = async (flagId: string, currentState: boolean) => {
    setUpdating(flagId);
    try {
      const { error } = await supabase
        .from('feature_flags')
        .update({ is_enabled: !currentState })
        .eq('id', flagId);

      if (error) throw error;

      setFlags(prev => prev.map(f =>
        f.id === flagId ? { ...f, is_enabled: !currentState } : f
      ));

      toast({
        title: 'Feature flag updated',
        description: `Flag ${!currentState ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      toast({
        title: 'Error updating flag',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setUpdating(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Feature Flags</h1>
          <p className="text-muted-foreground">
            Manage futuristic 2030+ features. Enable with caution.
          </p>
        </div>

        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Notice</AlertTitle>
          <AlertDescription>
            These are experimental features with specific privacy and security requirements.
            Read each security note carefully before enabling.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          {flags.map((flag) => (
            <Card key={flag.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">
                      {flag.flag_key.split('_').map(w =>
                        w.charAt(0).toUpperCase() + w.slice(1)
                      ).join(' ')}
                    </h3>
                    {flag.is_enabled ? (
                      <Badge className="bg-green-500">Enabled</Badge>
                    ) : (
                      <Badge variant="secondary">Disabled</Badge>
                    )}
                    {flag.requires_auth && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Auth Required
                      </Badge>
                    )}
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {flag.description}
                  </p>

                  {flag.security_notes && (
                    <Alert className="bg-muted">
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        {flag.security_notes}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="ml-4 flex flex-col items-end gap-2">
                  <Switch
                    checked={flag.is_enabled}
                    onCheckedChange={() => toggleFlag(flag.id, flag.is_enabled)}
                    disabled={updating === flag.id}
                  />
                  {updating === flag.id && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 flex gap-4">
          <Button onClick={() => navigate('/admin')} variant="outline">
            Back to Dashboard
          </Button>
          <Button onClick={loadFlags} variant="outline">
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}
