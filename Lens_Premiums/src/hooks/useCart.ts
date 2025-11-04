import { create } from 'zustand';
import axios from 'axios';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  saveCart: () => Promise<string>;
  loadSavedCart: (cartId: string) => Promise<void>;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id);
      
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
          total: state.total + item.price,
        };
      }
      
      return {
        items: [...state.items, { ...item, quantity: 1 }],
        total: state.total + item.price,
      };
    });
  },
  
  removeItem: (itemId) => {
    set((state) => {
      const item = state.items.find((i) => i.id === itemId);
      return {
        items: state.items.filter((i) => i.id !== itemId),
        total: state.total - (item ? item.price * item.quantity : 0),
      };
    });
  },
  
  updateQuantity: (itemId, quantity) => {
    set((state) => {
      const item = state.items.find((i) => i.id === itemId);
      if (!item) return state;
      
      const quantityDiff = quantity - item.quantity;
      return {
        items: state.items.map((i) =>
          i.id === itemId ? { ...i, quantity } : i
        ),
        total: state.total + item.price * quantityDiff,
      };
    });
  },
  
  clearCart: () => {
    set({ items: [], total: 0 });
  },
  
  saveCart: async () => {
    const { items } = get();
    const response = await api.post('/cart/save', { items });
    return response.data.cartId;
  },
  
  loadSavedCart: async (cartId) => {
    const response = await api.get(`/cart/${cartId}`);
    set({
      items: response.data.items,
      total: response.data.items.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
      ),
    });
  },
}));