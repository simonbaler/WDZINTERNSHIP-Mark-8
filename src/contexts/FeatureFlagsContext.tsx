import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface FeatureFlag {
  flag_key: string;
  is_enabled: boolean;
  description: string | null;
  requires_auth: boolean;
  security_notes: string | null;
}

interface FeatureFlagsContextType {
  flags: Record<string, FeatureFlag>;
  isEnabled: (flagKey: string) => boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export function FeatureFlagsProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>({});
  const [loading, setLoading] = useState(true);

  const loadFlags = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*');

      if (error) throw error;

      const flagsMap = (data || []).reduce((acc, flag) => {
        acc[flag.flag_key] = flag;
        return acc;
      }, {} as Record<string, FeatureFlag>);

      setFlags(flagsMap);
    } catch (error) {
      console.error('Error loading feature flags:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFlags();

    // Subscribe to flag changes
    const channel = supabase
      .channel('feature_flags_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flags'
        },
        () => {
          loadFlags();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const isEnabled = (flagKey: string): boolean => {
    return flags[flagKey]?.is_enabled || false;
  };

  const refresh = async () => {
    await loadFlags();
  };

  return (
    <FeatureFlagsContext.Provider value={{ flags, isEnabled, loading, refresh }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags() {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider');
  }
  return context;
}

export function useFeatureFlag(flagKey: string): boolean {
  const { isEnabled } = useFeatureFlags();
  return isEnabled(flagKey);
}
