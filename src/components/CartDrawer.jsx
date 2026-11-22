import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useUiStore } from '../store/uiStore';
import { computeTotals, FREE_SHIPPING_THRESHOLD } from '../utils/pricing';
import { formatPrice } from '../utils/format';
import CartItemRow from './CartItemRow';

export default function CartDrawer() {
  const open = useUiStore((state) => state.cartOpen);
  const closeCart = useUiStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const totals = useMemo(() => computeTotals(items, { couponCode }), [items, couponCode]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === 'Escape' && closeCart();
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, closeCart]);

  if (!open) return null;

  const remaining = FREE_SHIPPING_THRESHOLD - (totals.subtotal - totals.discount);
  const progress = Math.min(100, Math.max(0, ((totals.subtotal - totals.discount) / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={closeCart} aria-hidden="true" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="ตะกร้าสินค้า"
        className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold">ตะกร้าสินค้า</h2>
          <button onClick={closeCart} aria-label="ปิดตะกร้า" className="rounded-full p-2 hover:bg-tile">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-neutral-300" aria-hidden="true" />
            <p className="font-medium">ตะกร้าของคุณยังว่างอยู่</p>
            <Link
              to="/products"
              onClick={closeCart}
              className="mt-1 rounded-full bg-brand-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
            >
              เริ่มเลือกซื้อสินค้า
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-neutral-100 px-5 py-3 text-xs text-neutral-600">
              {remaining > 0 ? (
                <p>ซื้อเพิ่มอีก <strong className="text-brand-900">{formatPrice(remaining)}</strong> รับสิทธิ์ส่งฟรี</p>
              ) : (
                <p className="font-medium text-emerald-700">คุณได้รับสิทธิ์จัดส่งฟรีแล้ว</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-tile">
                <div className="h-full rounded-full bg-brand-700 transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-5">
              {items.map((item) => (
                <CartItemRow key={item.id} item={item} compact />
              ))}
            </ul>

            <div className="space-y-3 border-t border-neutral-200 px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">ยอดสินค้า</span>
                <span className="font-semibold tabular-nums">{formatPrice(totals.subtotal)}</span>
              </div>
              <p className="text-xs text-neutral-500">ค่าจัดส่งและส่วนลดคำนวณในหน้าถัดไป</p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="block rounded-full bg-brand-900 py-3.5 text-center text-sm font-medium text-white transition hover:bg-brand-700"
              >
                ชำระเงิน
              </Link>
              <Link
                to="/cart"
                onClick={closeCart}
                className="block rounded-full border border-neutral-300 py-3 text-center text-sm font-medium transition hover:bg-tile"
              >
                ดูตะกร้าทั้งหมด
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
