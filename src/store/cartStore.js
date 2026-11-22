import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_PER_ITEM = 20;
const limitFor = (stock) => Math.max(1, Math.min(stock ?? MAX_PER_ITEM, MAX_PER_ITEM));

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,

      /** คืนค่า 'ok' หรือ 'capped' (ถูกจำกัดตามสต็อก) */
      addItem: (product, quantity = 1) => {
        const limit = limitFor(product.stock);
        const existing = get().items.find((item) => item.id === product.id);
        const wanted = (existing?.quantity ?? 0) + quantity;
        const finalQty = Math.min(wanted, limit);

        set((state) => ({
          items: existing
            ? state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: finalQty } : item
              )
            : [
                ...state.items,
                {
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  originalPrice: product.originalPrice,
                  image: product.thumbnail,
                  category: product.category,
                  stock: product.stock,
                  quantity: finalQty,
                },
              ],
        }));
        return wanted > limit ? 'capped' : 'ok';
      },

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.max(1, Math.min(quantity, limitFor(item.stock))) }
              : item
          ),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      applyCoupon: (code) => set({ couponCode: code }),
      removeCoupon: () => set({ couponCode: null }),

      clearCart: () => set({ items: [], couponCode: null }),
    }),
    {
      name: 'shopwave-cart',
      version: 2,
      partialize: (state) => ({ items: state.items, couponCode: state.couponCode }),
    }
  )
);

export const selectCount = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);
