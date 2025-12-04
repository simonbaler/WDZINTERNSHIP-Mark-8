import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Globe } from 'lucide-react';
import { Language } from '@/store/languageStore';
import { useLanguageStore } from '@/store/languageStore';
import { translations } from '@/lib/translations';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (lang: Language) => void;
}

export function LanguageSelector({ isOpen, onClose, onSelectLanguage }: LanguageSelectorProps) {
  const handleLanguageSelect = (lang: Language) => {
    onSelectLanguage(lang);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-6 w-6 text-primary" />
            <DialogTitle>Select Your Preferred Language</DialogTitle>
          </div>
          <DialogDescription>
            Choose your preferred language to continue with the application
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden rounded-lg border-2 border-border p-6 transition-all hover:border-primary hover:shadow-lg"
            >
              {/* Background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 transition-opacity group-hover:opacity-100" />

              {/* Content */}
              <div className="relative z-10 text-center space-y-3">
                <div className="text-4xl">{lang.flag}</div>
                <div>
                  <h3 className="font-semibold text-lg">{lang.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {translations[lang.code].nav.login}
                  </p>
                </div>
              </div>

              {/* Animated border on hover */}
              <motion.div
                className="absolute inset-0 rounded-lg border-2 border-primary opacity-0"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          ))}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          You can change your language preference anytime in settings
        </p>
      </DialogContent>
    </Dialog>
  );
}
