import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

type Profile = {
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  city: string | null;
  state: string | null;
  created_at: string;
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [activeIds, setActiveIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, full_name, phone_number, city, state, created_at')
        .order('created_at', { ascending: false });
      if (!error && data) setCustomers(data as Profile[]);
    };
    fetchCustomers();

    // Realtime DB updates for profiles
    const dbChannel = supabase
      .channel('realtime:profiles')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, (payload: any) => {
        setCustomers((prev) => [payload.new as Profile, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload: any) => {
        setCustomers((prev) => prev.map((c) => (c.user_id === payload.new.user_id ? (payload.new as Profile) : c)));
      })
      .subscribe();

    // Presence: active customers across the app
    const presenceChannel = supabase.channel('online_users', {
      config: { presence: { key: 'admin_customers_' + Math.random().toString(36).slice(2) } },
    });

    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState() as Record<string, any[]>;
      const ids = Object.keys(state).filter((k) => state[k]?.some((m) => m.user_id && m.role === 'customer'));
      setActiveIds(ids);
    });

    presenceChannel.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        presenceChannel.track({ role: 'admin' });
      }
    });

    return () => {
      try { supabase.removeChannel(dbChannel); } catch {}
      try { supabase.removeChannel(presenceChannel); } catch {}
    };
  }, []);

  const totalCustomers = customers.length;

  const activeCustomers = useMemo(() => {
    const map = new Map(customers.map((c) => [c.user_id, c]));
    return activeIds.map((id) => map.get(id)).filter(Boolean) as Profile[];
  }, [activeIds, customers]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Customers</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalCustomers}</div>
            <div className="text-sm text-muted-foreground">All registered profiles</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{activeIds.length}</div>
            <div className="text-sm text-muted-foreground">Currently online customers</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {customers.map((c) => (
              <Link to={`/admin/customers/${c.user_id}`} key={c.user_id} className="flex items-center justify-between border rounded p-3 hover:bg-muted/50">
                <div>
                  <div className="font-medium">{c.full_name || 'Unnamed'}</div>
                  <div className="text-sm text-muted-foreground">
                    {[c.city, c.state].filter(Boolean).join(', ') || 'Location not set'}
                  </div>
                </div>
                <div className="text-sm">
                  <span className={activeIds.includes(c.user_id) ? 'text-green-600' : 'text-muted-foreground'}>
                    {activeIds.includes(c.user_id) ? 'Online' : 'Offline'}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {activeCustomers.length > 0 && (
            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Active Customers</div>
              <div className="grid grid-cols-1 gap-2">
                {activeCustomers.map((c) => (
                  <div key={`active-${c.user_id}`} className="flex items-center justify-between rounded p-2 bg-muted">
                    <div className="font-medium">{c.full_name || c.user_id}</div>
                    <div className="text-xs text-muted-foreground">{[c.city, c.state].filter(Boolean).join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}