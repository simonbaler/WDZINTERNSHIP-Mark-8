import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Check } from 'lucide-react';
import { Language, useLanguageStore } from '@/store/languageStore';
import { toast } from 'sonner';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

export function LanguageSettings() {
  const { language, setLanguage } = useLanguageStore();
  const [selectedLang, setSelectedLang] = useState<Language>(language);

  const handleLanguageChange = (lang: Language) => {
    setSelectedLang(lang);
    setLanguage(lang);
    toast.success(`Language changed to ${languages.find(l => l.code === lang)?.name}`);
  };

  return (
    <Card className="p-6 border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Globe className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg">Language Preference</h3>
          <p className="text-sm text-muted-foreground">Choose your preferred language</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {languages.map((lang, index) => (
          <motion.button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative p-4 rounded-lg border-2 transition-all ${
              selectedLang === lang.code
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            {/* Selected indicator */}
            {selectedLang === lang.code && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2"
              >
                <Badge className="bg-primary text-primary-foreground gap-1">
                  <Check className="h-3 w-3" />
                  Current
                </Badge>
              </motion.div>
            )}

            {/* Language content */}
            <div className="text-center space-y-2">
              <div className="text-3xl">{lang.flag}</div>
              <div className="text-sm font-medium">{lang.name}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-6 p-3 bg-muted/50 rounded-lg">
        💡 Your language preference will be applied across the entire application on your next visit.
      </p>
    </Card>
  );
}
