import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ระบบสมาชิกจำลอง: เก็บใน localStorage ของเบราว์เซอร์เท่านั้น (ไม่มี backend)
// รหัสผ่านถูกแฮชด้วย SHA-256 แต่ไม่ควรใช้เป็นระบบ auth จริง

async function hash(text) {
  if (globalThis.crypto?.subtle) {
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return btoa(unescape(encodeURIComponent(text)));
}

const normalizeEmail = (email) => email.trim().toLowerCase();

export const useAuthStore = create(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,

      register: async ({ name, email, password }) => {
        const key = normalizeEmail(email);
        if (get().users.some((user) => user.email === key)) {
          throw new Error('อีเมลนี้ถูกใช้สมัครสมาชิกแล้ว');
        }
        const user = {
          id: crypto.randomUUID?.() ?? String(Date.now()),
          name: name.trim(),
          email: key,
          phone: '',
          address: null,
          passwordHash: await hash(password),
          createdAt: Date.now(),
        };
        set((state) => ({ users: [...state.users, user], currentUserId: user.id }));
      },

      login: async ({ email, password }) => {
        const key = normalizeEmail(email);
        const user = get().users.find((u) => u.email === key);
        if (!user || user.passwordHash !== (await hash(password))) {
          throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        }
        set({ currentUserId: user.id });
      },

      logout: () => set({ currentUserId: null }),

      updateProfile: (patch) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === state.currentUserId ? { ...user, ...patch } : user
          ),
        })),
    }),
    { name: 'shopwave-auth', version: 1 }
  )
);

export const selectUser = (state) =>
  state.users.find((user) => user.id === state.currentUserId) ?? null;
