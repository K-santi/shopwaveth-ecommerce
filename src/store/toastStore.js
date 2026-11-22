import { create } from 'zustand';

let nextId = 0;
const DURATION_MS = 3200;

export const useToastStore = create((set, get) => ({
  toasts: [],

  /** show('ข้อความ', 'success' | 'error', { label, onClick }) */
  show: (message, type = 'success', action = null) => {
    const id = ++nextId;
    set((state) => ({ toasts: [...state.toasts.slice(-2), { id, message, type, action }] }));
    setTimeout(() => get().dismiss(id), DURATION_MS);
  },

  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) })),
}));
