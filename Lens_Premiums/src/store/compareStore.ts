import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

interface CompareStore {
  items: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  isInCompare: (productId: string) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCompare: (product) => {
        const items = get().items;
        if (items.length >= 4) {
          return; // Max 4 products to compare
        }
        if (!items.find(item => item.id === product.id)) {
          set({ items: [...items, product] });
        }
      },
      
      removeFromCompare: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },
      
      isInCompare: (productId) => {
        return get().items.some(item => item.id === productId);
      },
      
      clearCompare: () => set({ items: [] }),
    }),
    {
      name: 'compare-storage',
    }
  )
);
