import { Link } from 'react-router-dom';
import { GROUPS } from '../data/catalog';

export default function Footer() {
  return (
    <footer className="mt-12 bg-brand-950 text-brand-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className="text-xl font-semibold text-white">ShopWave</p>
          <p className="mt-3 text-sm leading-relaxed text-brand-200">
            ช้อปออนไลน์ครบทุกหมวด ส่งไว ชำระเงินง่ายด้วยพร้อมเพย์ บัตร หรือเก็บเงินปลายทาง
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">หมวดหมู่</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {GROUPS.slice(0, 5).map((group) => (
              <li key={group.id}>
                <Link to={`/products?group=${group.id}`} className="hover:text-white">
                  {group.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">บัญชีของฉัน</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/account" className="hover:text-white">ข้อมูลและคำสั่งซื้อ</Link></li>
            <li><Link to="/wishlist" className="hover:text-white">รายการโปรด</Link></li>
            <li><Link to="/cart" className="hover:text-white">ตะกร้าสินค้า</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">โค้ดส่วนลดสำหรับทดลอง</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><code className="rounded bg-white/10 px-1.5 py-0.5">SAVE10</code> ลด 10%</li>
            <li><code className="rounded bg-white/10 px-1.5 py-0.5">WELCOME100</code> ลด ฿100 (ครบ ฿1,000)</li>
            <li><code className="rounded bg-white/10 px-1.5 py-0.5">FREESHIP</code> ส่งฟรี</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-brand-200 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} ShopWave — โปรเจกต์สาธิตสำหรับพอร์ตโฟลิโอ ไม่มีการขายสินค้าจริง</p>
          <p>
            ข้อมูลสินค้าจาก{' '}
            <a href="https://dummyjson.com" target="_blank" rel="noreferrer" className="underline hover:text-white">
              DummyJSON
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
