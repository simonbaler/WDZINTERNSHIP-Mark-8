// Import necessary dependencies from Zustand and the Product type
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/types/product';

// Define the interface for the products store
interface ProductsStore {
  products: Product[];
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'slug'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  getProductsBySearch: (query: string) => Product[];
}

// Create the products store using Zustand, with persistence middleware
export const useProductsStore = create<ProductsStore>()(
  persist(
    (set, get) => ({
      // Initialize the products array
      products: [],
      
      // Fetches products from the backend API and updates the store
      fetchProducts: async () => {
        try {
          const response = await fetch('http://localhost:5000/api/products');
          if (!response.ok) {
            throw new Error('Failed to fetch products');
          }
          const products = await response.json();
          set({ products });
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      },
      
      // Adds a new product to the store
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

      // Updates an existing product in the store
      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      // Deletes a product from the store
      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      // Retrieves a single product by its ID
      getProduct: (id) => {
        return get().products.find((p) => p.id === id);
      },

      // Retrieves all products that belong to a specific category
      getProductsByCategory: (category) => {
        return get().products.filter((p) => p.category === category);
      },

      // Searches for products based on a query string
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
      // The name of the item in storage
      name: 'products-storage',
    }
  )
);
