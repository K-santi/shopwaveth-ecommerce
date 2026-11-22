import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { COUPONS, FREE_SHIPPING_THRESHOLD, VAT_RATE, validateCoupon } from '../utils/pricing';
import { formatPrice } from '../utils/format';

function CouponBox({ subtotal }) {
  const couponCode = useCartStore((state) => state.couponCode);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const showToast = useToastStore((state) => state.show);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const tryApply = (code) => {
    const result = validateCoupon(code, subtotal);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    applyCoupon(result.code);
    setInput('');
    setError('');
    showToast(`ใช้โค้ด ${result.code} แล้ว`);
  };

  if (couponCode) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
        <span className="flex items-center gap-2">
          <Tag className="h-4 w-4" aria-hidden="true" />
          <strong>{couponCode}</strong>
          <span className="hidden text-xs sm:inline">{COUPONS[couponCode]?.label}</span>
        </span>
        <button onClick={removeCoupon} aria-label="ยกเลิกโค้ดส่วนลด" className="rounded-full p-1 hover:bg-emerald-100">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          tryApply(input);
        }}
        className="flex gap-2"
      >
        <label htmlFor="coupon" className="sr-only">โค้ดส่วนลด</label>
        <input
          id="coupon"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setError('');
          }}
          placeholder="โค้ดส่วนลด"
          className="min-w-0 flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm uppercase outline-none focus:border-brand-700 focus:ring-4 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="rounded-xl bg-brand-900 px-4 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          ใช้โค้ด
        </button>
      </form>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      <p className="mt-2 flex flex-wrap gap-1.5 text-xs text-neutral-500">
        ลองใช้:
        {Object.keys(COUPONS).map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => tryApply(code)}
            className="rounded-full bg-white px-2.5 py-0.5 font-medium text-brand-700 ring-1 ring-brand-100 hover:bg-brand-50"
          >
            {code}
          </button>
        ))}
      </p>
    </div>
  );
}

export default function OrderSummary({ items, totals, showItems = false, children }) {
  const remaining = FREE_SHIPPING_THRESHOLD - (totals.subtotal - totals.discount);

  return (
    <aside className="h-fit space-y-5 rounded-3xl bg-tile p-6 lg:sticky lg:top-40">
      <h2 className="text-lg font-semibold">สรุปคำสั่งซื้อ</h2>

      {showItems && (
        <ul className="divide-y divide-neutral-200">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-3">
              <div className="h-14 w-14 shrink-0 rounded-xl bg-white p-2">
                <img src={item.image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium">{item.title}</p>
                <p className="text-xs text-neutral-500">จำนวน {item.quantity}</p>
              </div>
              <p className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
      )}

      <CouponBox subtotal={totals.subtotal} />

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-neutral-600">ยอดสินค้า</dt>
          <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <dt>ส่วนลด</dt>
            <dd className="tabular-nums">-{formatPrice(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-neutral-600">ค่าจัดส่ง</dt>
          <dd className="tabular-nums">{totals.shipping === 0 ? 'ฟรี' : formatPrice(totals.shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-neutral-200 pt-3 text-base font-semibold">
          <dt>ยอดรวมสุทธิ</dt>
          <dd className="tabular-nums text-brand-900">{formatPrice(totals.total)}</dd>
        </div>
        <div className="flex justify-between text-xs text-neutral-500">
          <dt>รวมภาษีมูลค่าเพิ่ม {Math.round(VAT_RATE * 100)}% แล้ว</dt>
          <dd className="tabular-nums">{formatPrice(totals.vat)}</dd>
        </div>
      </dl>

      {totals.shipping > 0 && remaining > 0 && (
        <p className="rounded-xl bg-white px-4 py-3 text-xs text-neutral-600">
          ซื้อเพิ่มอีก {formatPrice(remaining)} รับสิทธิ์ส่งฟรี (จัดส่งธรรมดา)
        </p>
      )}

      {children && <div>{children}</div>}
    </aside>
  );
}
