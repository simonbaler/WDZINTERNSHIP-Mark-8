import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export default function Profile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id) return;
      setEmail(user.email ?? '');
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          // Create a profile row if missing
          const insert = {
            user_id: user.id,
            full_name: (user as any)?.user_metadata?.full_name ?? null,
            phone_number: (user as any)?.user_metadata?.phone_number ?? null,
            city: (user as any)?.user_metadata?.city ?? null,
            state: (user as any)?.user_metadata?.state ?? null,
            pincode: (user as any)?.user_metadata?.pincode ?? null,
            latitude: (user as any)?.user_metadata?.latitude ?? null,
            longitude: (user as any)?.user_metadata?.longitude ?? null,
          };
          const { data: created, error: createError } = await supabase
            .from('profiles')
            .insert(insert)
            .select()
            .maybeSingle();
          if (createError) throw createError;
          if (created) populate(created);
        } else {
          populate(data);
        }
      } catch (e: any) {
        console.error('Failed loading profile', e);
        toast.error(e.message || 'Failed to load profile');
      }
    };

    const populate = (p: any) => {
      setFullName(p.full_name || '');
      setPhoneNumber(p.phone_number || '');
      setCity(p.city || '');
      setState(p.state || '');
      setPincode(p.pincode || '');
      setLatitude(p.latitude != null ? String(p.latitude) : '');
      setLongitude(p.longitude != null ? String(p.longitude) : '');
    };

    loadProfile();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Update profile fields (excluding phone number)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName || null,
          city: city || null,
          state: state || null,
          pincode: pincode || null,
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
        })
        .eq('user_id', user.id);
      if (profileError) throw profileError;

      // Update email if changed
      if (email && email !== (user.email ?? '')) {
        const { data: emailData, error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
        // Supabase sends a confirmation email to the new address
        if (emailData?.user?.email !== email) {
          toast.info('Check your new email to confirm the change.');
        }
      }

      toast.success('Profile updated successfully');
    } catch (e: any) {
      console.error('Profile update failed', e);
      toast.error(e.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border p-6 space-y-6">
      <h2 className="text-2xl font-bold">Profile Information</h2>

      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone (read-only)</Label>
        <Input id="phone" type="tel" value={phoneNumber} disabled />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input id="pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input id="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input id="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}
