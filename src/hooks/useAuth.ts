import { useEffect, useRef, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, session, setUser, setSession, signOut: storeSignOut } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const presenceChannelRef = useRef<any>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status after state update
        const override = localStorage.getItem('ADMIN_OVERRIDE') === 'true';
        if (override) {
          setIsAdmin(true);
          return;
        }
        if (session?.user) {
          setTimeout(() => checkAdminStatus(session.user.id), 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      const override = localStorage.getItem('ADMIN_OVERRIDE') === 'true';
      if (override) {
        setIsAdmin(true);
      } else if (session?.user) {
        setTimeout(() => checkAdminStatus(session.user.id), 0);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser]);

  // Broadcast presence for logged-in users so admin can see active customers
  useEffect(() => {
    // Clean up any existing presence channel when user changes
    if (presenceChannelRef.current) {
      try { supabase.removeChannel(presenceChannelRef.current); } catch {}
      presenceChannelRef.current = null;
    }

    if (user?.id) {
      const channel = supabase.channel('online_users', {
        config: {
          presence: { key: user.id },
        },
      });

      channel.subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          channel.track({ user_id: user.id, role: 'customer', full_name: (user as any)?.user_metadata?.full_name });
        }
      });

      presenceChannelRef.current = channel;
    }

    return () => {
      if (presenceChannelRef.current) {
        try { supabase.removeChannel(presenceChannelRef.current); } catch {}
        presenceChannelRef.current = null;
      }
    };
  }, [user]);

  const checkAdminStatus = async (userId: string) => {
    try {
      const override = localStorage.getItem('ADMIN_OVERRIDE') === 'true';
      if (override) {
        setIsAdmin(true);
        return;
      }
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      setIsAdmin(!!data);
    } catch (error) {
      setIsAdmin(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata,
      },
    });
    // If signup succeeded and we have a user, create the profile row
    try {
      const userId = data?.user?.id;
      if (userId) {
        await supabase.from('profiles').insert({
          user_id: userId,
          full_name: metadata?.full_name ?? null,
          phone_number: metadata?.phone_number ?? null,
          address: metadata?.address ?? null,
          city: metadata?.city ?? null,
          state: metadata?.state ?? null,
          pincode: metadata?.pincode ?? null,
          latitude: metadata?.latitude ?? null,
          longitude: metadata?.longitude ?? null,
        });
      }
    } catch (e) {
      // Non-blocking: profile insertion may fail if email confirmation required or RLS rules
      console.warn('Profile insert failed:', e);
    }
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      storeSignOut();
      localStorage.removeItem('ADMIN_OVERRIDE');
      setIsAdmin(false);
    }
    return { error };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/auth`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    });
    return { data, error };
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
