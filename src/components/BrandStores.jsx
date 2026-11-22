import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const TONES = [
  'bg-brand-900 text-white',
  'bg-rose-600 text-white',
  'bg-emerald-600 text-white',
  'bg-amber-500 text-white',
  'bg-violet-600 text-white',
  'bg-sky-600 text-white',
  'bg-neutral-900 text-white',
  'bg-teal-600 text-white',
];

export default function BrandStores({ products, limit = 8 }) {
  const brands = useMemo(() => {
    const counts = new Map();
    products.forEach((p) => p.brand && counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1));
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, limit);
  }, [products, limit]);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {brands.map(([brand, count], index) => (
        <Link
          key={brand}
          to={`/products?brand=${encodeURIComponent(brand)}`}
          className="flex items-center gap-3 rounded-xl bg-tile p-3 transition hover:shadow-md hover:ring-1 hover:ring-brand-100"
        >
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold ${TONES[index % TONES.length]}`}
            aria-hidden="true"
          >
            {brand.charAt(0).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium">{brand}</span>
            <span className="block text-[11px] text-neutral-500">{count} สินค้า · ส่งใน 24 ชม.</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
