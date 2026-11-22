import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

/** หัวข้อ + แถวสินค้า (เลื่อนแนวนอนบนมือถือ, 5 คอลัมน์บนจอใหญ่) */
export default function ProductRow({ title, to, products }) {
  if (!products.length) return null;

  return (
    <section aria-label={title}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
        {to && (
          <Link to={to} className="flex items-center gap-0.5 text-xs font-medium text-brand-700 hover:underline">
            ดูทั้งหมด <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            className="w-[44%] min-w-36 shrink-0 snap-start sm:w-[31%] lg:w-[calc(20%-13px)]"
          />
        ))}
      </div>
    </section>
  );
}
