import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';
import { mockProducts } from '@/lib/mockData';

interface ProductsStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getProductsBySearch: (query: string) => Product[];
}

export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      products: mockProducts,

      addProduct: (product) => {
        const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const newProduct: Product = {
          ...product,
          slug,
          id: Date.now().toString(),
          images: Array.isArray(product.images) ? product.images : [],
          badges: Array.isArray((product as any).badges) ? (product as any).badges : ['new'],
        };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
        return newProduct;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      getProduct: (id) => {
        return get().products.find((p) => p.id === id);
      },

      getProductsByCategory: (category) => {
        return get().products.filter((p) => p.category === category);
      },

      getProductsBySearch: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().products.filter((p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.brand.toLowerCase().includes(lowerQuery) ||
          p.description?.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'products-storage',
    }
  )
);