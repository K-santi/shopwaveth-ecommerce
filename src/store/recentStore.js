import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRecentStore = create(
  persist(
    (set) => ({
      ids: [],
      push: (id) =>
        set((state) => ({ ids: [id, ...state.ids.filter((x) => x !== id)].slice(0, 12) })),
    }),
    { name: 'shopwave-recent' }
  )
);
