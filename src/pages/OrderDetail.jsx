import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { CircleCheck, Clock, PackageSearch } from 'lucide-react';
import { ORDER_STATUS, PAYMENT_LABELS, useOrderStore } from '../store/orderStore';
import { useToastStore } from '../store/toastStore';
import { PROMPTPAY_ID, buildPromptPayPayload } from '../services/promptpay';
import { SHIPPING_METHODS } from '../utils/pricing';
import { formatDate, formatPrice } from '../utils/format';

export default function OrderDetail() {
  const { id } = useParams();
  const order = useOrderStore((state) => state.orders.find((o) => o.id === id));
  const markPaid = useOrderStore((state) => state.markPaid);
  const showToast = useToastStore((state) => state.show);

  const payload = useMemo(
    () => (order?.status === 'awaiting_payment' ? buildPromptPayPayload(PROMPTPAY_ID, order.totals.total) : ''),
    [order?.status, order?.totals.total]
  );

  if (!order) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-20 text-center">
        <PackageSearch className="h-14 w-14 text-neutral-300" aria-hidden="true" />
        <h1 className="text-2xl font-semibold">ไม่พบคำสั่งซื้อ {id}</h1>
        <p className="text-neutral-500">คำสั่งซื้อถูกเก็บไว้ในเบราว์เซอร์นี้เท่านั้น</p>
        <Link to="/" className="rounded-full bg-brand-900 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700">
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  const status = ORDER_STATUS[order.status];
  const shipping = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod);
  const awaiting = order.status === 'awaiting_payment';

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="flex flex-col items-center gap-3 text-center">
        {awaiting ? (
          <Clock className="h-16 w-16 text-amber-500" aria-hidden="true" />
        ) : (
          <CircleCheck className="h-16 w-16 text-emerald-500" aria-hidden="true" />
        )}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {awaiting ? 'สแกน QR เพื่อชำระเงิน' : 'ขอบคุณสำหรับคำสั่งซื้อ!'}
        </h1>
        <p className="text-sm text-neutral-600">
          หมายเลขคำสั่งซื้อ <span className="font-mono font-semibold text-neutral-900">{order.id}</span>
          {!awaiting && <> · เราจะส่งอีเมลยืนยันไปที่ <strong>{order.customer.email}</strong></>}
        </p>
      </header>

      {awaiting && (
        <section className="flex flex-col items-center gap-4 rounded-3xl bg-tile p-8 text-center">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <QRCodeSVG value={payload} size={208} level="M" marginSize={1} />
          </div>
          <p className="text-3xl font-semibold text-brand-900">{formatPrice(order.totals.total)}</p>
          <p className="max-w-sm text-sm text-neutral-600">
            เปิดแอปธนาคารแล้วสแกน QR นี้ (PromptPay) ระบบจะแสดงยอดเงินให้อัตโนมัติ
          </p>
          <p className="max-w-sm rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-800">
            QR นี้เป็นโหมดสาธิต ผูกกับบัญชีสมมติ อย่าโอนเงินจริง ใช้ปุ่มด้านล่างเพื่อจำลองว่าชำระเงินสำเร็จ
          </p>
          <button
            onClick={() => {
              markPaid(order.id);
              showToast('ได้รับการชำระเงินแล้ว ขอบคุณค่ะ');
            }}
            className="rounded-full bg-brand-900 px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            จำลองการชำระเงินสำเร็จ
          </button>
        </section>
      )}

      <section className="grid gap-6 rounded-3xl border border-neutral-200 p-6 sm:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold">สถานะ</h2>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${status.tone}`}>{status.label}</span>
          <p className="mt-3 text-xs text-neutral-500">สั่งซื้อเมื่อ {formatDate(order.createdAt)}</p>
          {order.paidAt && <p className="text-xs text-neutral-500">ชำระเงินเมื่อ {formatDate(order.paidAt)}</p>}
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold">ที่อยู่จัดส่ง</h2>
          <address className="text-sm not-italic leading-relaxed text-neutral-700">
            {order.customer.name} · {order.customer.phone}
            <br />
            {order.address.address} แขวง/ตำบล{order.address.subdistrict} เขต/อำเภอ{order.address.district}
            <br />
            {order.address.province} {order.address.zip}
          </address>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold">วิธีจัดส่ง</h2>
          <p className="text-sm text-neutral-700">{shipping?.label} ({shipping?.eta})</p>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-semibold">วิธีชำระเงิน</h2>
          <p className="text-sm text-neutral-700">
            {PAYMENT_LABELS[order.payment]}
            {order.cardLast4 && ` (ลงท้าย ${order.cardLast4})`}
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-neutral-200 p-6">
        <h2 className="mb-2 text-sm font-semibold">รายการสินค้า</h2>
        <ul className="divide-y divide-neutral-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4 py-3">
              <div className="h-16 w-16 shrink-0 rounded-xl bg-tile p-2">
                <img src={item.image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
              </div>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${item.id}`} className="line-clamp-1 text-sm font-medium hover:underline">{item.title}</Link>
                <p className="text-xs text-neutral-500">{formatPrice(item.price)} × {item.quantity}</p>
              </div>
              <p className="text-sm font-medium tabular-nums">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-neutral-600">ยอดสินค้า</dt><dd>{formatPrice(order.totals.subtotal)}</dd></div>
          {order.totals.discount > 0 && (
            <div className="flex justify-between text-emerald-700"><dt>ส่วนลด ({order.couponCode})</dt><dd>-{formatPrice(order.totals.discount)}</dd></div>
          )}
          <div className="flex justify-between"><dt className="text-neutral-600">ค่าจัดส่ง</dt><dd>{order.totals.shipping === 0 ? 'ฟรี' : formatPrice(order.totals.shipping)}</dd></div>
          <div className="flex justify-between text-base font-semibold"><dt>ยอดรวมสุทธิ</dt><dd className="text-brand-900">{formatPrice(order.totals.total)}</dd></div>
          <div className="flex justify-between text-xs text-neutral-500"><dt>รวมภาษีมูลค่าเพิ่ม 7% แล้ว</dt><dd>{formatPrice(order.totals.vat)}</dd></div>
        </dl>
      </section>

      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/products" className="rounded-full bg-brand-900 px-8 py-3 text-sm font-medium text-white hover:bg-brand-700">
          เลือกซื้อสินค้าต่อ
        </Link>
        <Link to="/account" className="rounded-full border border-neutral-300 px-8 py-3 text-sm font-medium hover:bg-tile">
          ดูคำสั่งซื้อทั้งหมด
        </Link>
      </div>
    </div>
  );
}
