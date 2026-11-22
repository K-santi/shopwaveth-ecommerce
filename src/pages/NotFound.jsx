import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
      <p className="text-7xl font-semibold text-neutral-200">404</p>
      <h1 className="text-2xl font-semibold">ไม่พบหน้าที่คุณต้องการ</h1>
      <p className="text-neutral-500">หน้านี้อาจถูกย้ายหรือลบไปแล้ว</p>
      <Link to="/" className="mt-2 rounded-full bg-brand-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-brand-700">
        กลับหน้าแรก
      </Link>
    </div>
  );
}
