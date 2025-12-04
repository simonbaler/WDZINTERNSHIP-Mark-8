import React, { createContext, useContext } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { t, getTranslation } from '@/lib/translations';

interface LanguageContextType {
  t: (path: string, defaultValue?: string) => string;
  translations: Record<string, any>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useLanguageStore((state) => state.language);
  const translations = getTranslation(language);

  const translate = (path: string, defaultValue?: string) => {
    return t(language, path, defaultValue);
  };

  return (
    <LanguageContext.Provider value={{ t: translate, translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}
