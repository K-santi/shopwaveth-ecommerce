import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore, selectCount } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { computeTotals } from '../utils/pricing';
import CartItemRow from '../components/CartItemRow';
import OrderSummary from '../components/OrderSummary';

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const clearCart = useCartStore((state) => state.clearCart);
  const count = useCartStore(selectCount);
  const showToast = useToastStore((state) => state.show);
  const totals = useMemo(() => computeTotals(items, { couponCode }), [items, couponCode]);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
        <ShoppingBag className="h-14 w-14 text-neutral-300" aria-hidden="true" />
        <h1 className="text-2xl font-semibold">ตะกร้าของคุณยังว่างอยู่</h1>
        <p className="text-neutral-500">เลือกสินค้าที่ถูกใจแล้วเพิ่มลงตะกร้าได้เลย</p>
        <Link
          to="/products"
          className="mt-2 rounded-full bg-brand-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          เริ่มเลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">ตะกร้าสินค้า</h1>
          <p className="mt-1 text-sm text-neutral-500">{count} ชิ้น</p>
        </div>
        <button
          onClick={() => {
            clearCart();
            showToast('ล้างตะกร้าแล้ว');
          }}
          className="text-sm text-neutral-500 underline underline-offset-2 transition hover:text-neutral-900"
        >
          ล้างตะกร้า
        </button>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <ul className="divide-y divide-neutral-200 border-y border-neutral-200 lg:col-span-2">
          {items.map((item) => (
            <CartItemRow key={item.id} item={item} />
          ))}
        </ul>

        <OrderSummary items={items} totals={totals}>
          <Link
            to="/checkout"
            className="block w-full rounded-full bg-brand-900 px-6 py-3.5 text-center text-sm font-medium text-white transition hover:bg-brand-700"
          >
            ดำเนินการชำระเงิน
          </Link>
          <Link to="/products" className="mt-3 block text-center text-sm text-neutral-600 hover:text-neutral-900">
            เลือกซื้อสินค้าต่อ
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}
