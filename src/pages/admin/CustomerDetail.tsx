import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

type Profile = {
  user_id: string;
  full_name: string | null;
  phone_number: string | null;
  city: string | null;
  state: string | null;
  pincode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at: string;
};

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeIds, setActiveIds] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', id)
        .maybeSingle();
      if (error) {
        toast.error('Failed to load customer');
        return;
      }
      setProfile(data as Profile);
    };
    load();

    // realtime updates for this profile
    const dbChannel = supabase
      .channel('realtime:profiles:detail')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `user_id=eq.${id}` }, (payload: any) => {
        setProfile(payload.new as Profile);
      })
      .subscribe();

    // presence tracking
    const presenceChannel = supabase.channel('online_users', {
      config: { presence: { key: 'admin_detail_' + Math.random().toString(36).slice(2) } },
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
  }, [id]);

  const isActive = useMemo(() => (id ? activeIds.includes(id) : false), [activeIds, id]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { full_name, phone_number, city, state, pincode, latitude, longitude } = profile;
    const { error } = await supabase
      .from('profiles')
      .update({ full_name, phone_number, city, state, pincode, latitude, longitude })
      .eq('user_id', profile.user_id);
    setSaving(false);
    if (error) {
      toast.error('Failed to save changes');
    } else {
      toast.success('Customer updated');
    }
  };

  const handleDelete = async () => {
    if (!profile) return;
    if (!window.confirm('Delete this customer profile? This does not delete the auth account.')) return;
    setDeleting(true);
    const { error } = await supabase.from('profiles').delete().eq('user_id', profile.user_id);
    setDeleting(false);
    if (error) {
      toast.error('Failed to delete customer');
      return;
    }
    toast.success('Customer profile deleted');
    navigate('/admin/customers');
  };

  if (!id) return <div className="p-6">Invalid customer id</div>;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Detail</h1>
        <Link to="/admin/customers" className="text-sm text-primary">Back to Customers</Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {!profile ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={profile.full_name ?? ''} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input value={profile.phone_number ?? ''} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={profile.city ?? ''} onChange={(e) => setProfile({ ...profile, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={profile.state ?? ''} onChange={(e) => setProfile({ ...profile, state: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Pincode</Label>
                <Input value={profile.pincode ?? ''} onChange={(e) => setProfile({ ...profile, pincode: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Latitude</Label>
                <Input type="number" value={profile.latitude ?? ''} onChange={(e) => setProfile({ ...profile, latitude: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div className="space-y-2">
                <Label>Longitude</Label>
                <Input type="number" value={profile.longitude ?? ''} onChange={(e) => setProfile({ ...profile, longitude: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className={isActive ? 'text-green-600' : 'text-muted-foreground'}>
                  {isActive ? 'Online' : 'Offline'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Created At</Label>
                <div className="text-sm text-muted-foreground">{new Date(profile.created_at).toLocaleString()}</div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} disabled={!profile || saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={!profile || deleting}>{deleting ? 'Deleting...' : 'Delete Customer'}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}