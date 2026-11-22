import { useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Banknote, CreditCard, Loader2, QrCode } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { selectUser, useAuthStore } from '../store/authStore';
import { generateOrderId, useOrderStore } from '../store/orderStore';
import { useUiStore } from '../store/uiStore';
import { PROVINCES } from '../data/catalog';
import { SHIPPING_METHODS, computeTotals } from '../utils/pricing';
import { formatPrice } from '../utils/format';
import {
  formatCardNumber, formatExpiry, isCardNumber, isCvv, isEmail, isExpiryValid, isThaiPhone, isZip,
} from '../utils/validators';
import FormField from '../components/FormField';
import OrderSummary from '../components/OrderSummary';

const PAYMENTS = [
  { id: 'promptpay', label: 'พร้อมเพย์ (PromptPay QR)', hint: 'สแกนจ่ายผ่านแอปธนาคาร', icon: QrCode },
  { id: 'card', label: 'บัตรเครดิต / เดบิต', hint: 'Visa, Mastercard, JCB', icon: CreditCard },
  { id: 'cod', label: 'เก็บเงินปลายทาง', hint: 'ชำระเงินสดเมื่อรับสินค้า', icon: Banknote },
];

const REQUIRED = {
  fullName: (v) => (v.trim().length < 2 ? 'กรุณากรอกชื่อ-นามสกุล' : ''),
  phone: (v) => (isThaiPhone(v) ? '' : 'กรุณากรอกเบอร์โทร 9–10 หลัก เช่น 0812345678'),
  email: (v) => (isEmail(v) ? '' : 'กรุณากรอกอีเมลให้ถูกต้อง'),
  address: (v) => (v.trim().length < 5 ? 'กรุณากรอกที่อยู่ (บ้านเลขที่ ถนน ซอย)' : ''),
  subdistrict: (v) => (v.trim().length < 2 ? 'กรุณากรอกแขวง/ตำบล' : ''),
  district: (v) => (v.trim().length < 2 ? 'กรุณากรอกเขต/อำเภอ' : ''),
  province: (v) => (PROVINCES.includes(v) ? '' : 'กรุณาเลือกจังหวัด'),
  zip: (v) => (isZip(v) ? '' : 'รหัสไปรษณีย์ต้องมี 5 หลัก'),
};

const CARD_RULES = {
  cardNumber: (v) => (isCardNumber(v) ? '' : 'เลขบัตรไม่ถูกต้อง'),
  cardName: (v) => (v.trim().length < 2 ? 'กรุณากรอกชื่อบนบัตร' : ''),
  expiry: (v) => (isExpiryValid(v) ? '' : 'วันหมดอายุไม่ถูกต้อง (MM/YY)'),
  cvv: (v) => (isCvv(v) ? '' : 'CVV ต้องมี 3–4 หลัก'),
};

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const couponCode = useCartStore((state) => state.couponCode);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore(selectUser);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const addOrder = useOrderStore((state) => state.addOrder);
  const defaultProvince = useUiStore((state) => state.province);
  const placed = useRef(false);

  const [values, setValues] = useState({
    fullName: user?.name ?? '',
    phone: user?.phone ?? '',
    email: user?.email ?? '',
    address: user?.address?.address ?? '',
    subdistrict: user?.address?.subdistrict ?? '',
    district: user?.address?.district ?? '',
    province: user?.address?.province ?? defaultProvince,
    zip: user?.address?.zip ?? '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [payment, setPayment] = useState('promptpay');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(
    () => computeTotals(items, { couponCode, shippingMethod }),
    [items, couponCode, shippingMethod]
  );

  const rules = useMemo(
    () => (payment === 'card' ? { ...REQUIRED, ...CARD_RULES } : REQUIRED),
    [payment]
  );

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (name === 'cardNumber') value = formatCardNumber(value);
    if (name === 'expiry') value = formatExpiry(value);
    if (name === 'zip') value = value.replace(/\D/g, '').slice(0, 5);
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
  };

  // ตรวจเมื่อออกจากช่อง (blur) เพื่อไม่ให้แสดงข้อผิดพลาดตั้งแต่ยังพิมพ์ไม่เสร็จ
  const handleBlur = (event) => {
    const { name } = event.target;
    const message = rules[name]?.(values[name]) ?? '';
    setErrors((current) => ({ ...current, [name]: message }));
  };

  const field = (name) => ({
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    error: errors[name],
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    Object.entries(rules).forEach(([name, rule]) => {
      const message = rule(values[name]);
      if (message) nextErrors[name] = message;
    });
    setErrors(nextErrors);

    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200)); // จำลองการประมวลผลชำระเงิน

    const id = generateOrderId();
    const address = {
      address: values.address.trim(),
      subdistrict: values.subdistrict.trim(),
      district: values.district.trim(),
      province: values.province,
      zip: values.zip,
    };

    addOrder({
      id,
      createdAt: Date.now(),
      userId: user?.id ?? null,
      items,
      totals,
      couponCode: totals.couponApplied ? couponCode : null,
      shippingMethod,
      payment,
      cardLast4: payment === 'card' ? values.cardNumber.replace(/\s/g, '').slice(-4) : null,
      status: payment === 'promptpay' ? 'awaiting_payment' : payment === 'cod' ? 'cod_pending' : 'paid',
      customer: { name: values.fullName.trim(), phone: values.phone, email: values.email.trim() },
      address,
    });

    if (user) updateProfile({ phone: values.phone, address });

    placed.current = true;
    navigate(`/order/${id}`, { replace: true });
    clearCart();
  };

  if (items.length === 0 && !placed.current) return <Navigate to="/cart" replace />;

  const submitLabel = submitting ? (
    <>
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> กำลังดำเนินการ…
    </>
  ) : payment === 'promptpay' ? (
    `สั่งซื้อและรับ QR · ${formatPrice(totals.total)}`
  ) : (
    `ยืนยันคำสั่งซื้อ · ${formatPrice(totals.total)}`
  );
  const submitClass =
    'inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-6 py-3.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60';

  return (
    <div>
      <Link to="/cart" className="mb-6 inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> กลับไปที่ตะกร้า
      </Link>
      <h1 className="mb-8 text-3xl font-semibold tracking-tight">ชำระเงิน</h1>

      {!user && (
        <p className="mb-6 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login?next=/checkout" className="font-medium underline">เข้าสู่ระบบ</Link>{' '}
          เพื่อกรอกที่อยู่อัตโนมัติและดูประวัติคำสั่งซื้อ หรือสั่งซื้อแบบไม่ต้องสมัครสมาชิกก็ได้
        </p>
      )}

      <div className="grid gap-10 lg:grid-cols-5">
        <form id="checkout-form" onSubmit={handleSubmit} noValidate className="space-y-9 lg:col-span-3">
          <fieldset className="space-y-4">
            <legend className="mb-2 text-lg font-semibold">ข้อมูลติดต่อ</legend>
            <FormField label="ชื่อ-นามสกุล" autoComplete="name" {...field('fullName')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="เบอร์โทรศัพท์" type="tel" inputMode="tel" autoComplete="tel" placeholder="0812345678" {...field('phone')} />
              <FormField label="อีเมล" type="email" autoComplete="email" placeholder="you@example.com" {...field('email')} />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-2 text-lg font-semibold">ที่อยู่จัดส่ง</legend>
            <FormField label="ที่อยู่ (บ้านเลขที่ หมู่บ้าน ถนน ซอย)" autoComplete="street-address" {...field('address')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="แขวง / ตำบล" {...field('subdistrict')} />
              <FormField label="เขต / อำเภอ" {...field('district')} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="จังหวัด" as="select" {...field('province')}>
                {PROVINCES.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </FormField>
              <FormField label="รหัสไปรษณีย์" inputMode="numeric" autoComplete="postal-code" placeholder="10110" {...field('zip')} />
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-2 text-lg font-semibold">วิธีจัดส่ง</legend>
            {SHIPPING_METHODS.map((method) => {
              const fee = computeTotals(items, { couponCode, shippingMethod: method.id }).shipping;
              return (
                <label
                  key={method.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                    shippingMethod === method.id ? 'border-brand-800 bg-brand-50' : 'border-neutral-200 hover:bg-tile'
                  }`}
                >
                  <input
                    type="radio"
                    name="shippingMethod"
                    checked={shippingMethod === method.id}
                    onChange={() => setShippingMethod(method.id)}
                    className="h-4 w-4 accent-brand-900"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium">{method.label}</span>
                    <span className="block text-xs text-neutral-500">{method.eta}</span>
                  </span>
                  <span className="text-sm font-medium">{fee === 0 ? 'ฟรี' : formatPrice(fee)}</span>
                </label>
              );
            })}
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="mb-2 text-lg font-semibold">วิธีชำระเงิน</legend>
            {PAYMENTS.map(({ id, label, hint, icon: Icon }) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                  payment === id ? 'border-brand-800 bg-brand-50' : 'border-neutral-200 hover:bg-tile'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={payment === id}
                  onChange={() => setPayment(id)}
                  className="h-4 w-4 accent-brand-900"
                />
                <Icon className="h-5 w-5 text-brand-800" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-xs text-neutral-500">{hint}</span>
                </span>
              </label>
            ))}

            {payment === 'card' && (
              <div className="animate-fade-in space-y-4 rounded-2xl bg-tile p-5">
                <FormField label="หมายเลขบัตร" inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" {...field('cardNumber')} />
                <FormField label="ชื่อบนบัตร" autoComplete="cc-name" {...field('cardName')} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="วันหมดอายุ" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/YY" {...field('expiry')} />
                  <FormField label="CVV" inputMode="numeric" autoComplete="cc-csc" placeholder="123" {...field('cvv')} />
                </div>
                <p className="text-xs text-neutral-500">
                  โหมดสาธิต: ใช้เลขบัตรทดสอบ 4242 4242 4242 4242 และวันหมดอายุในอนาคต ข้อมูลบัตรจะไม่ถูกบันทึกหรือส่งไปที่ใด
                </p>
              </div>
            )}
          </fieldset>

          <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
            นี่คือร้านค้าสาธิต ไม่มีการเรียกเก็บเงินหรือจัดส่งสินค้าจริง
          </p>

          <button type="submit" disabled={submitting} className={`${submitClass} lg:hidden`}>
            {submitLabel}
          </button>
        </form>

        <div className="lg:col-span-2">
          <OrderSummary items={items} totals={totals} showItems>
            <button type="submit" form="checkout-form" disabled={submitting} className={`${submitClass} hidden lg:inline-flex`}>
              {submitLabel}
            </button>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
