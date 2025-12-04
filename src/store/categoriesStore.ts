import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string; // emoji
  color: string; // hex color or tailwind color
  description?: string;
  createdAt: number;
}

interface CategoriesStore {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Category;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategory: (id: string) => Category | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

// Default categories for camera equipment
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat_1',
    name: 'Cameras',
    slug: 'cameras',
    icon: '📷',
    color: '#3B82F6',
    description: 'Digital and film cameras',
    createdAt: Date.now(),
  },
  {
    id: 'cat_2',
    name: 'Lenses',
    slug: 'lenses',
    icon: '🔍',
    color: '#8B5CF6',
    description: 'Camera lenses and attachments',
    createdAt: Date.now(),
  },
  {
    id: 'cat_3',
    name: 'Accessories',
    slug: 'accessories',
    icon: '🎒',
    color: '#EC4899',
    description: 'Camera bags, tripods, and more',
    createdAt: Date.now(),
  },
  {
    id: 'cat_4',
    name: 'Bundles',
    slug: 'bundles',
    icon: '📦',
    color: '#F59E0B',
    description: 'Complete camera kits',
    createdAt: Date.now(),
  },
];

export const useCategoriesStore = create<CategoriesStore>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,

      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: `cat_${Date.now()}`,
          createdAt: Date.now(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
        return newCategory;
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, ...updates } : cat
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((cat) => cat.id !== id),
        }));
      },

      getCategory: (id) => {
        return get().categories.find((cat) => cat.id === id);
      },

      getCategoryBySlug: (slug) => {
        return get().categories.find((cat) => cat.slug === slug);
      },
    }),
    {
      name: 'categories-store',
    }
  )
);
