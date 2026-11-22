import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ORDER_STATUS = {
  awaiting_payment: { label: 'รอชำระเงิน', tone: 'bg-amber-100 text-amber-800' },
  cod_pending: { label: 'ชำระเงินปลายทาง', tone: 'bg-sky-100 text-sky-800' },
  paid: { label: 'ชำระเงินแล้ว', tone: 'bg-emerald-100 text-emerald-800' },
};

export const PAYMENT_LABELS = {
  promptpay: 'พร้อมเพย์ (PromptPay QR)',
  card: 'บัตรเครดิต/เดบิต',
  cod: 'เก็บเงินปลายทาง',
};

export function generateOrderId() {
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SW${stamp}${random}`;
}

export const useOrderStore = create(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      markPaid: (id) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status: 'paid', paidAt: Date.now() } : order
          ),
        })),
    }),
    { name: 'shopwave-orders', version: 1 }
  )
);
