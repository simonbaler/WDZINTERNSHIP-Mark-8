import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'zh';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  isFirstTimeUser: boolean;
  setFirstTimeUser: (isFirst: boolean) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: 'en',
      isFirstTimeUser: true,
      
      setLanguage: (language) => set({ language }),
      setFirstTimeUser: (isFirst) => set({ isFirstTimeUser: isFirst }),
    }),
    {
      name: 'language-storage',
    }
  )
);
