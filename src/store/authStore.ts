import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Session } from '@supabase/supabase-js';

interface AuthStore {
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      
      setUser: (user) => set({ user }),
      setSession: (session) => set({ session, user: session?.user ?? null }),
      signOut: () => set({ user: null, session: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
