import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUiStore = create(
  persist(
    (set) => ({
      cartOpen: false,
      province: 'กรุงเทพมหานคร',
      openCart: () => set({ cartOpen: true }),
      closeCart: () => set({ cartOpen: false }),
      setProvince: (province) => set({ province }),
    }),
    {
      name: 'shopwave-ui',
      partialize: (state) => ({ province: state.province }),
    }
  )
);
