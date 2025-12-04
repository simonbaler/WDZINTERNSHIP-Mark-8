import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiPickerProps {
  value: string;
  onChange: (emoji: string) => void;
}

const EMOJI_CATEGORIES = {
  'Camera': ['📷', '📹', '🎥', '📸', '🎬', '🔭', '🔬'],
  'Tech': ['💻', '⚙️', '🔧', '⚡', '🎛️', '📡', '💡'],
  'Objects': ['🎒', '👜', '🧳', '💼', '🎁', '📦', '🛍️'],
  'Nature': ['🌞', '🌍', '🏔️', '🌊', '🌳', '⛅', '🌈'],
  'Fun': ['⭐', '✨', '🎯', '🎪', '🎨', '🎭', '🎸'],
};

export const EmojiPicker = ({ value, onChange }: EmojiPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => setIsOpen(!isOpen)}
        className="text-2xl w-16 h-16 flex items-center justify-center"
      >
        {value || '😀'}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 bg-card border border-border rounded-lg shadow-lg p-3 z-50 w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                <div key={category}>
                  <p className="text-xs font-semibold text-muted-foreground px-2 py-1">
                    {category}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => {
                          onChange(emoji);
                          setIsOpen(false);
                        }}
                        className={`text-2xl p-2 rounded-lg transition-all ${
                          value === emoji
                            ? 'bg-primary text-primary-foreground scale-110'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
