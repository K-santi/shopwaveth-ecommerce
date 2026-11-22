export const VAT_RATE = 0.07; // ราคาแสดงเป็นราคารวม VAT แล้ว
export const FREE_SHIPPING_THRESHOLD = 999;

export const SHIPPING_METHODS = [
  { id: 'standard', label: 'จัดส่งธรรมดา', eta: 'ภายใน 2–4 วันทำการ', fee: 50, freeOverThreshold: true },
  { id: 'express', label: 'จัดส่งด่วนพิเศษ', eta: 'ภายในวันถัดไป', fee: 120, freeOverThreshold: false },
];

export const COUPONS = {
  SAVE10: { label: 'ลด 10% (สูงสุด ฿500)', type: 'percent', value: 10, cap: 500, min: 0 },
  WELCOME100: { label: 'ลด ฿100 เมื่อซื้อครบ ฿1,000', type: 'fixed', value: 100, min: 1000 },
  FREESHIP: { label: 'ส่งฟรี ไม่มีขั้นต่ำ', type: 'shipping', min: 0 },
};

export function validateCoupon(code, subtotal) {
  const key = String(code ?? '').trim().toUpperCase();
  const coupon = COUPONS[key];
  if (!coupon) return { ok: false, error: 'ไม่พบโค้ดส่วนลดนี้' };
  if (subtotal < coupon.min) {
    return { ok: false, error: `โค้ดนี้ใช้ได้เมื่อซื้อครบ ฿${coupon.min.toLocaleString('th-TH')}` };
  }
  return { ok: true, code: key, coupon };
}

export function computeTotals(items, { couponCode = null, shippingMethod = 'standard' } = {}) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const check = couponCode ? validateCoupon(couponCode, subtotal) : null;
  const coupon = check?.ok ? check.coupon : null;

  let discount = 0;
  if (coupon?.type === 'percent') {
    discount = Math.min(Math.round((subtotal * coupon.value) / 100), coupon.cap);
  } else if (coupon?.type === 'fixed') {
    discount = Math.min(coupon.value, subtotal);
  }

  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethod) ?? SHIPPING_METHODS[0];
  const afterDiscount = subtotal - discount;
  const freeByThreshold = method.freeOverThreshold && afterDiscount >= FREE_SHIPPING_THRESHOLD;
  const freeByCoupon = coupon?.type === 'shipping' && method.id === 'standard';
  const shipping = items.length === 0 || freeByThreshold || freeByCoupon ? 0 : method.fee;

  const total = afterDiscount + shipping;
  const vat = Math.round(((total * VAT_RATE) / (1 + VAT_RATE)) * 100) / 100;

  return { subtotal, discount, shipping, vat, total, couponApplied: Boolean(coupon) };
}
