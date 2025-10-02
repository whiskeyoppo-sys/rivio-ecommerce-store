// Fully conceptualized - Cart management hook
// Design choice: Optimistic updates for better UX

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variantId?: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  syncCart: () => Promise<void>;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      addItem: async (product) => {
        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const newItem = { ...product, id: tempId };
        
        set((state) => ({
          items: [...state.items, newItem],
        }));

        try {
          const response = await api.post('/cart/items', product);
          
          // Replace temp item with server response
          set((state) => ({
            items: state.items.map((item) =>
              item.id === tempId ? response.data : item
            ),
          }));
          
          toast.success('Added to cart');
        } catch (error) {
          // Revert optimistic update
          set((state) => ({
            items: state.items.filter((item) => item.id !== tempId),
          }));
          toast.error('Failed to add to cart');
        }
      },

      updateQuantity: async (itemId, quantity) => {
        if (quantity <= 0) {
          return get().removeItem(itemId);
        }

        // Optimistic update
        const originalItems = [...get().items];
        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));

        try {
          await api.patch(`/cart/items/${itemId}`, { quantity });
        } catch (error) {
          // Revert on error
          set({ items: originalItems });
          toast.error('Failed to update quantity');
        }
      },

      removeItem: async (itemId) => {
        // Optimistic update
        const originalItems = [...get().items];
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));

        try {
          await api.delete(`/cart/items/${itemId}`);
          toast.success('Removed from cart');
        } catch (error) {
          // Revert on error
          set({ items: originalItems });
          toast.error('Failed to remove item');
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      syncCart: async () => {
        set({ isLoading: true });
        try {
          const response = await api.get('/cart');
          set({ items: response.data.items, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error('Failed to sync cart:', error);
        }
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
