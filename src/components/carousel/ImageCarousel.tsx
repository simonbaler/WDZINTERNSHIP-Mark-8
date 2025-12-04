import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Slide {
  id: string;
  image: string;
  title: string;
  description: string;
  accent?: string;
}

interface ImageCarouselProps {
  slides: Slide[];
  autoplayInterval?: number;
  onSlideChange?: (index: number) => void;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const indicatorVariants = {
  inactive: { scale: 0.8, opacity: 0.5 },
  active: { scale: 1, opacity: 1 },
};

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  slides,
  autoplayInterval = 6000,
  onSlideChange,
}) => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Paginate through slides
  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrent((prev) => (prev + newDirection + slides.length) % slides.length);
    },
    [slides.length]
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!carouselRef.current?.contains(document.activeElement)) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          setIsAutoplay(false);
          paginate(-1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          setIsAutoplay(false);
          paginate(1);
          break;
        case ' ':
          e.preventDefault();
          setIsAutoplay((prev) => !prev);
          break;
        case 'Home':
          e.preventDefault();
          setCurrent(0);
          setIsAutoplay(false);
          break;
        case 'End':
          e.preventDefault();
          setCurrent(slides.length - 1);
          setIsAutoplay(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paginate, slides.length]);

  // Autoplay functionality
  useEffect(() => {
    if (!isAutoplay) return;

    autoplayTimeoutRef.current = setTimeout(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, autoplayInterval);

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [current, isAutoplay, autoplayInterval, slides.length]);

  // Call callback on slide change
  useEffect(() => {
    onSlideChange?.(current);
  }, [current, onSlideChange]);

  // Pause autoplay on focus/hover
  const handleMouseEnter = () => {
    setIsAutoplay(false);
  };

  const handleMouseLeave = () => {
    setIsAutoplay(true);
  };

  const handleCarouselFocus = () => {
    setIsFocused(true);
  };

  const handleCarouselBlur = () => {
    setIsFocused(false);
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  const currentSlide = slides[current];

  return (
    <div
      ref={carouselRef}
      className="relative w-full h-full rounded-3xl overflow-hidden bg-gradient-to-br from-accent/20 via-primary/10 to-accent/5 border border-accent/20 shadow-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleCarouselFocus}
      onBlur={handleCarouselBlur}
      role="region"
      aria-label="Image carousel"
      aria-roledescription="carousel"
      tabIndex={-1}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Content Overlay */}
        <motion.div
          key={`content-${current}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-2">{currentSlide.title}</h3>
          <p className="text-sm md:text-base text-white/90">{currentSlide.description}</p>
        </motion.div>
      </div>

      {/* Previous Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
      >
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white hover:text-white"
          onClick={() => {
            setIsAutoplay(false);
            paginate(-1);
          }}
          aria-label={`Previous slide (${current} of ${slides.length})`}
          aria-controls="carousel-slides"
        >
          <ChevronLeft className="h-6 w-6" aria-hidden="true" />
        </Button>
      </motion.div>

      {/* Next Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
      >
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white hover:text-white"
          onClick={() => {
            setIsAutoplay(false);
            paginate(1);
          }}
          aria-label={`Next slide (${current} of ${slides.length})`}
          aria-controls="carousel-slides"
        >
          <ChevronRight className="h-6 w-6" aria-hidden="true" />
        </Button>
      </motion.div>

      {/* Slide Indicators */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
        role="tablist"
        aria-label="Slide indicators"
      >
        {slides.map((slide, index) => (
          <motion.button
            key={slide.id}
            variants={indicatorVariants}
            initial="inactive"
            animate={index === current ? 'active' : 'inactive'}
            onClick={() => {
              setCurrent(index);
              setIsAutoplay(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCurrent(index);
                setIsAutoplay(false);
              }
            }}
            className={`h-2.5 rounded-full transition-all cursor-pointer ${
              index === current ? 'bg-white w-8' : 'bg-white/50 w-2.5'
            }`}
            role="tab"
            aria-selected={index === current}
            aria-label={`Go to slide ${index + 1} of ${slides.length}: ${slide.title}`}
            tabIndex={index === current ? 0 : -1}
          />
        ))}
      </div>

      {/* Autoplay Status Indicator */}
      <div
        className="absolute top-4 right-4 text-white/60 text-xs font-medium backdrop-blur-sm bg-black/20 px-3 py-1.5 rounded-full"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {isAutoplay ? 'Autoplay' : 'Paused'} • {current + 1}/{slides.length}
      </div>

      {/* Hidden slide list for screen readers */}
      <div id="carousel-slides" className="sr-only" role="listbox">
        {slides.map((slide, index) => (
          <div key={slide.id} role="option" aria-selected={index === current}>
            Slide {index + 1}: {slide.title} - {slide.description}
          </div>
        ))}
      </div>

      {/* Keyboard navigation hints */}
      <div className="sr-only" role="complementary" aria-label="Keyboard navigation instructions">
        <p>
          Use arrow keys to navigate slides. Press space to toggle autoplay. Press Home for first
          slide, End for last slide.
        </p>
      </div>
    </div>
  );
};

export default ImageCarousel;
