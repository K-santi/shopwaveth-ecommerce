import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { selectUser, useAuthStore } from '../store/authStore';
import { ORDER_STATUS, useOrderStore } from '../store/orderStore';
import { useToastStore } from '../store/toastStore';
import FormField from '../components/FormField';
import { formatDate, formatPrice } from '../utils/format';
import { isThaiPhone } from '../utils/validators';

export default function Account() {
  const user = useAuthStore(selectUser);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const orders = useOrderStore((state) => state.orders);
  const showToast = useToastStore((state) => state.show);

  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? '');
  const [errors, setErrors] = useState({});

  const myOrders = orders.filter((order) => order.userId === user.id);

  const save = (event) => {
    event.preventDefault();
    const next = {};
    if (name.trim().length < 2) next.name = 'กรุณากรอกชื่อของคุณ';
    if (phone && !isThaiPhone(phone)) next.phone = 'เบอร์โทรไม่ถูกต้อง';
    setErrors(next);
    if (Object.keys(next).length) return;
    updateProfile({ name: name.trim(), phone });
    showToast('บันทึกข้อมูลแล้ว');
  };

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <section>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">บัญชีของฉัน</h1>
        <form onSubmit={save} noValidate className="space-y-4 rounded-3xl bg-tile p-6">
          <FormField label="ชื่อ" name="name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
          <FormField label="อีเมล" name="email" value={user.email} readOnly disabled hint="ไม่สามารถเปลี่ยนอีเมลได้" />
          <FormField label="เบอร์โทรศัพท์" name="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} />
          {user.address && (
            <div className="rounded-xl bg-white p-4 text-sm text-neutral-700">
              <p className="mb-1 font-medium">ที่อยู่ล่าสุดที่ใช้จัดส่ง</p>
              {user.address.address} {user.address.subdistrict} {user.address.district} {user.address.province} {user.address.zip}
            </div>
          )}
          <button type="submit" className="w-full rounded-full bg-brand-900 py-3 text-sm font-medium text-white transition hover:bg-brand-700">
            บันทึกข้อมูล
          </button>
        </form>
      </section>

      <section className="lg:col-span-2">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">คำสั่งซื้อของฉัน</h2>
        {myOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-neutral-300 py-16 text-center">
            <Package className="h-12 w-12 text-neutral-300" aria-hidden="true" />
            <p className="font-medium">ยังไม่มีคำสั่งซื้อ</p>
            <p className="text-sm text-neutral-500">คำสั่งซื้อที่สั่งหลังเข้าสู่ระบบจะแสดงที่นี่</p>
            <Link to="/products" className="mt-1 rounded-full bg-brand-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700">
              เริ่มเลือกซื้อสินค้า
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {myOrders.map((order) => {
              const status = ORDER_STATUS[order.status];
              return (
                <li key={order.id}>
                  <Link to={`/order/${order.id}`} className="block rounded-2xl border border-neutral-200 p-5 transition hover:border-brand-200 hover:shadow-md">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-mono text-sm font-semibold">{order.id}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.tone}`}>{status.label}</span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">{formatDate(order.createdAt)}</p>
                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 4).map((item) => (
                          <img key={item.id} src={item.image} alt="" className="h-10 w-10 rounded-full bg-tile object-contain p-1 ring-2 ring-white" />
                        ))}
                        {order.items.length > 4 && (
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tile text-xs ring-2 ring-white">
                            +{order.items.length - 4}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-brand-900">{formatPrice(order.totals.total)}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
