import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SiteSettingsState = {
  welcomeVideoUrl: string | null;
  setWelcomeVideoUrl: (url: string) => void;
  clearWelcomeVideoUrl: () => void;
};

export const useSiteSettingsStore = create(
  persist<SiteSettingsState>(
    (set) => ({
      welcomeVideoUrl: null,
      setWelcomeVideoUrl: (url: string) => set({ welcomeVideoUrl: url || null }),
      clearWelcomeVideoUrl: () => set({ welcomeVideoUrl: null }),
    }),
    {
      name: 'site-settings',
      version: 1,
    }
  )
);