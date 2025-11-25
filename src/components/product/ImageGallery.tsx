import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageGalleryProps {
  images: string[];
  videos?: string[];
  productName: string;
}
type MediaItem = { type: 'image' | 'video'; url: string };

export function ImageGallery({ images, videos = [], productName }: ImageGalleryProps) {
  const imageItems: MediaItem[] = images.map((u) => ({ type: 'image' as const, url: u }));
  const videoItems: MediaItem[] = videos.map((u) => ({ type: 'video' as const, url: u.trim() }));
  const media: MediaItem[] = [...imageItems, ...videoItems];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextItem = () => {
    setSelectedIndex((prev) => (prev + 1) % media.length);
  };

  const prevItem = () => {
    setSelectedIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative aspect-square bg-muted rounded-lg overflow-hidden group cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          {media[selectedIndex]?.type === 'image' ? (
            <img
              src={media[selectedIndex].url}
              alt={`${productName} - View ${selectedIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <video
              src={media[selectedIndex].url}
              controls
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLVideoElement;
                target.poster = '/video-error-placeholder.png'; // optionally show error poster image if available
                target.style.display = 'none'; // hide broken video
                console.error('Video failed to play:', target.src);
                // Removed alert popup for better UX
              }}
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </motion.div>

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-4">
          {media.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`aspect-square bg-muted rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-transparent hover:border-primary/50'
              }`}
            >
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center bg-black/70 text-white">
                  <span className="text-xs">Video</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-6xl h-[90vh] p-0 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <AnimatePresence mode="wait">
              {media[selectedIndex]?.type === 'image' ? (
                <motion.img
                  key={`img-${selectedIndex}`}
                  src={media[selectedIndex].url}
                  alt={`${productName} - View ${selectedIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                />
              ) : (
                <motion.video
                  key={`vid-${selectedIndex}`}
                  src={media[selectedIndex].url}
                  className="max-w-full max-h-full"
                  controls
                  autoPlay
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </AnimatePresence>

            {media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 text-white hover:bg-white/20"
                  onClick={prevItem}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 text-white hover:bg-white/20"
                  onClick={nextItem}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {media.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    selectedIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
