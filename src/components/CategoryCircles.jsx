import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { GROUPS } from '../data/catalog';

export default function CategoryCircles({ products }) {
  const scroller = useRef(null);

  // ใช้รูปสินค้าคะแนนสูงสุดของแต่ละกลุ่มเป็นภาพตัวแทน
  const cover = (slugs) =>
    products
      .filter((p) => slugs.includes(p.category))
      .sort((a, b) => b.rating - a.rating)[0]?.thumbnail;

  return (
    <div className="relative">
      <div ref={scroller} className="no-scrollbar flex gap-5 overflow-x-auto scroll-smooth pb-2">
        {GROUPS.map((group) => (
          <Link
            key={group.id}
            to={`/products?group=${group.id}`}
            className="group flex w-24 shrink-0 flex-col items-center gap-3 sm:w-28"
          >
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-tile p-4 transition group-hover:ring-4 group-hover:ring-brand-100 sm:h-28 sm:w-28">
              <img
                src={cover(group.slugs)}
                alt=""
                loading="lazy"
                className="h-full w-full object-contain mix-blend-multiply"
              />
            </span>
            <span className="text-center text-[13px] font-medium">{group.label}</span>
          </Link>
        ))}
      </div>
      <button
        onClick={() => scroller.current?.scrollBy({ left: 300 })}
        aria-label="เลื่อนดูหมวดหมู่ถัดไป"
        className="absolute -right-2 top-10 hidden h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white shadow-md transition hover:bg-tile sm:flex lg:hidden"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
