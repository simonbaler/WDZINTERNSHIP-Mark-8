import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { heroCarouselSlides } from '@/lib/carouselData';

export type HeroSlide = {
  id: string;
  image: string;
  title: string;
  description: string;
  accent?: string;
};

type HeroSlidesState = {
  slides: HeroSlide[];
  setSlides: (slides: HeroSlide[]) => void;
  addSlide: (slide: Omit<HeroSlide, 'id'>) => HeroSlide;
  updateSlide: (id: string, updates: Partial<HeroSlide>) => void;
  deleteSlide: (id: string) => void;
};

export const useHeroSlidesStore = create(
  persist<HeroSlidesState>(
    (set, get) => ({
      slides: heroCarouselSlides,
      setSlides: (slides) => set({ slides }),
      addSlide: (slide) => {
        const newSlide: HeroSlide = { ...slide, id: `slide_${Date.now()}` };
        set((state) => ({ slides: [...state.slides, newSlide] }));
        return newSlide;
      },
      updateSlide: (id, updates) => {
        set((state) => ({
          slides: state.slides.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },
      deleteSlide: (id) => {
        set((state) => ({ slides: state.slides.filter((s) => s.id !== id) }));
      },
    }),
    {
      name: 'hero-slides-storage',
      version: 1,
    }
  )
);

