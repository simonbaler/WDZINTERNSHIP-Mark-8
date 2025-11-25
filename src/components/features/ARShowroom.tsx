/**
 * AR Showroom Component (SCAFFOLD)
 * 
 * This is a placeholder for the live AR collaborative product viewing feature.
 * When enabled, this allows users to:
 * - Create AR sessions for products
 * - Invite others to join
 * - View products together in real-time AR
 */

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Video, Users, Share2, Loader2 } from 'lucide-react';

interface ARShowroomProps {
  productId: string;
  productName: string;
}

export function ARShowroom({ productId, productName }: ARShowroomProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createSession = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ar-showroom', {
        body: {
          action: 'create',
          productId
        }
      });

      if (error) throw error;

      setSessionId(data.session.session_id);
      toast({
        title: 'AR Session Created',
        description: 'Share the session ID to invite others'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create session',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const joinSession = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ar-showroom', {
        body: {
          action: 'join',
          sessionId: id
        }
      });

      if (error) throw error;

      toast({
        title: 'Joined AR Session',
        description: 'You are now in the AR showroom'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to join session',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Video className="h-6 w-6" />
        <div>
          <h3 className="text-lg font-semibold">AR Showroom</h3>
          <p className="text-sm text-muted-foreground">
            View {productName} in collaborative AR
          </p>
        </div>
        <Badge variant="outline" className="ml-auto">Beta</Badge>
      </div>

      {!sessionId ? (
        <div className="space-y-4">
          <Button
            onClick={createSession}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Users className="h-4 w-4 mr-2" />
            )}
            Create AR Session
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or join existing
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter session ID"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  joinSession((e.target as HTMLInputElement).value);
                }
              }}
            />
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Session ID</p>
            <code className="text-xs">{sessionId}</code>
          </div>

          <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-2" />
              <p className="text-sm">AR View Placeholder</p>
              <p className="text-xs">WebRTC stream would appear here</p>
            </div>
          </div>

          <Button variant="outline" onClick={() => setSessionId(null)} className="w-full">
            Leave Session
          </Button>
        </div>
      )}
    </Card>
  );
}
