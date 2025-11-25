import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Webhooks() {
  const [configs, setConfigs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newConfig, setNewConfig] = useState({
    name: '',
    description: '',
    event_type: 'order.created',
    webhook_url: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadConfigs(), loadEvents()]);
    setLoading(false);
  };

  const loadConfigs = async () => {
    const { data, error } = await (supabase as any)
      .from('webhook_configs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load webhook configs');
      console.error(error);
    } else {
      setConfigs(data || []);
    }
  };

  const loadEvents = async () => {
    const { data, error } = await (supabase as any)
      .from('webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      toast.error('Failed to load webhook events');
      console.error(error);
    } else {
      setEvents(data || []);
    }
  };

  const handleAddConfig = async () => {
    if (!newConfig.name || !newConfig.webhook_url) {
      toast.error('Name and webhook URL are required');
      return;
    }

    const { error } = await (supabase as any)
      .from('webhook_configs')
      .insert(newConfig);

    if (error) {
      toast.error('Failed to create webhook config');
      console.error(error);
    } else {
      toast.success('Webhook config created');
      setShowAddDialog(false);
      setNewConfig({ name: '', description: '', event_type: 'order.created', webhook_url: '' });
      loadConfigs();
    }
  };

  const handleToggleActive = async (id: string, currentState: boolean) => {
    const { error } = await (supabase as any)
      .from('webhook_configs')
      .update({ is_active: !currentState })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update webhook');
      console.error(error);
    } else {
      toast.success(`Webhook ${!currentState ? 'enabled' : 'disabled'}`);
      loadConfigs();
    }
  };

  const handleReplay = async (eventId: string) => {
    toast.info('Replaying webhook...');
    
    const { data, error } = await supabase.functions.invoke('replay-webhook', {
      body: { eventId },
    });

    if (error) {
      toast.error('Failed to replay webhook');
      console.error(error);
    } else {
      toast.success('Webhook replayed successfully');
      loadEvents();
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-500' },
      failed: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-500' },
      pending: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-500' },
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Webhooks & n8n Integration</h1>
          <p className="text-muted-foreground">Manage webhook configurations and monitor events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Webhook Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newConfig.name}
                    onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
                    placeholder="Order Processing Webhook"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={newConfig.description}
                    onChange={(e) => setNewConfig({ ...newConfig, description: e.target.value })}
                    placeholder="Processes new orders via n8n"
                  />
                </div>
                <div>
                  <Label>Event Type</Label>
                  <Select
                    value={newConfig.event_type}
                    onValueChange={(value) => setNewConfig({ ...newConfig, event_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order.created">order.created</SelectItem>
                      <SelectItem value="order.updated">order.updated</SelectItem>
                      <SelectItem value="cart.abandoned">cart.abandoned</SelectItem>
                      <SelectItem value="stock.low">stock.low</SelectItem>
                      <SelectItem value="review.requested">review.requested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Webhook URL (n8n)</Label>
                  <Input
                    value={newConfig.webhook_url}
                    onChange={(e) => setNewConfig({ ...newConfig, webhook_url: e.target.value })}
                    placeholder="https://your-n8n-instance.com/webhook/..."
                  />
                </div>
                <Button onClick={handleAddConfig} className="w-full">
                  Create Webhook
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="configs">
        <TabsList>
          <TabsTrigger value="configs">Webhook Configs ({configs.length})</TabsTrigger>
          <TabsTrigger value="events">Recent Events ({events.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="configs" className="space-y-4">
          {configs.map((config) => (
            <Card key={config.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{config.name}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge>{config.event_type}</Badge>
                    <Badge variant={config.is_active ? 'default' : 'secondary'}>
                      {config.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">URL:</span> {config.webhook_url}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(config.id, config.is_active)}
                    >
                      {config.is_active ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {configs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium">No webhook configurations</p>
                <p className="text-muted-foreground">Click "Add Webhook" to create your first webhook</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Badge variant="outline">{event.event_type}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                    <TableCell>
                      {event.attempts}/{event.max_attempts}
                    </TableCell>
                    <TableCell>
                      {new Date(event.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {(event.status === 'failed' || event.status === 'completed') && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReplay(event.id)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Replay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
