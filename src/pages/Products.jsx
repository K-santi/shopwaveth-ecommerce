import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronRight, SearchX, SlidersHorizontal, Star, X } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import { GROUPS, categoryLabel, groupById } from '../data/catalog';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ErrorState from '../components/ErrorState';
import Pagination from '../components/Pagination';
import { formatPrice } from '../utils/format';

const PAGE_SIZE = 20;

const SORT_OPTIONS = [
  { value: 'featured', label: 'แนะนำ' },
  { value: 'price-asc', label: 'ราคา: ต่ำไปสูง' },
  { value: 'price-desc', label: 'ราคา: สูงไปต่ำ' },
  { value: 'rating', label: 'คะแนนสูงสุด' },
  { value: 'discount', label: 'ลดราคามากที่สุด' },
];

const SORTERS = {
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating || b.ratingCount - a.ratingCount,
  discount: (a, b) => b.discount - a.discount,
};

/* ---------- แผงตัวกรอง (ใช้ทั้งในแถบข้างและหน้าต่างมือถือ) ---------- */
function FilterPanel({ params, update, brands, onClear }) {
  const group = params.get('group');
  const category = params.get('category');
  const selectedBrands = params.getAll('brand');
  const rating = params.get('rating') ?? '';
  const [min, setMin] = useState(params.get('min') ?? '');
  const [max, setMax] = useState(params.get('max') ?? '');

  useEffect(() => {
    setMin(params.get('min') ?? '');
    setMax(params.get('max') ?? '');
  }, [params]);

  const section = 'border-b border-neutral-100 py-5 first:pt-0';
  const heading = 'mb-3 text-sm font-semibold';

  const applyPrice = (event) => {
    event.preventDefault();
    update({ min: min || null, max: max || null });
  };

  const toggleBrand = (brand) => {
    const next = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    update({ brand: next });
  };

  return (
    <div>
      <div className={section}>
        <h3 className={heading}>หมวดหมู่</h3>
        <ul className="space-y-1 text-sm">
          {GROUPS.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => update({ group: g.id, category: null })}
                className={`w-full rounded-lg px-3 py-1.5 text-left transition hover:bg-tile ${
                  group === g.id && !category ? 'bg-brand-50 font-medium text-brand-800' : ''
                }`}
              >
                {g.label}
              </button>
              {(group === g.id || g.slugs.includes(category)) && (
                <ul className="ml-3 mt-1 space-y-1 border-l border-neutral-200 pl-3">
                  {g.slugs.map((slug) => (
                    <li key={slug}>
                      <button
                        onClick={() => update({ group: null, category: category === slug ? null : slug })}
                        className={`w-full rounded-lg px-2 py-1 text-left text-[13px] transition hover:bg-tile ${
                          category === slug ? 'font-medium text-brand-800' : 'text-neutral-600'
                        }`}
                      >
                        {categoryLabel(slug)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={applyPrice} className={section}>
        <h3 className={heading}>ช่วงราคา (บาท)</h3>
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="price-min">ราคาต่ำสุด</label>
          <input
            id="price-min"
            inputMode="numeric"
            value={min}
            onChange={(event) => setMin(event.target.value.replace(/\D/g, ''))}
            placeholder="ต่ำสุด"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-700"
          />
          <span className="text-neutral-400">–</span>
          <label className="sr-only" htmlFor="price-max">ราคาสูงสุด</label>
          <input
            id="price-max"
            inputMode="numeric"
            value={max}
            onChange={(event) => setMax(event.target.value.replace(/\D/g, ''))}
            placeholder="สูงสุด"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand-700"
          />
        </div>
        <button
          type="submit"
          className="mt-3 w-full rounded-full bg-brand-900 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          ใช้ช่วงราคา
        </button>
      </form>

      {brands.length > 0 && (
        <div className={section}>
          <h3 className={heading}>แบรนด์</h3>
          <ul className="max-h-56 space-y-1 overflow-y-auto pr-1 text-sm">
            {brands.map(([brand, count]) => (
              <li key={brand}>
                <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-tile">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="h-4 w-4 accent-brand-900"
                  />
                  <span className="flex-1 truncate">{brand}</span>
                  <span className="text-xs text-neutral-400">{count}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={section}>
        <h3 className={heading}>คะแนนรีวิว</h3>
        <ul className="space-y-1 text-sm">
          {['4', '3'].map((value) => (
            <li key={value}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-tile">
                <input
                  type="radio"
                  name="rating"
                  checked={rating === value}
                  onChange={() => update({ rating: value })}
                  className="h-4 w-4 accent-brand-900"
                />
                <span className="flex items-center gap-1">
                  {value} <Star className="h-3.5 w-3.5 fill-brand-800 text-brand-800" /> ขึ้นไป
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2 pt-5">
        <label className="flex cursor-pointer items-center gap-2.5 px-2 text-sm">
          <input
            type="checkbox"
            checked={params.get('deal') === '1'}
            onChange={(event) => update({ deal: event.target.checked ? '1' : null })}
            className="h-4 w-4 accent-brand-900"
          />
          เฉพาะสินค้าลดราคา
        </label>
        <label className="flex cursor-pointer items-center gap-2.5 px-2 text-sm">
          <input
            type="checkbox"
            checked={params.get('stock') === '1'}
            onChange={(event) => update({ stock: event.target.checked ? '1' : null })}
            className="h-4 w-4 accent-brand-900"
          />
          เฉพาะสินค้าพร้อมส่ง
        </label>
        <button onClick={onClear} className="mt-3 w-full rounded-full border border-neutral-300 py-2 text-sm hover:bg-tile">
          ล้างตัวกรองทั้งหมด
        </button>
      </div>
    </div>
  );
}

/* ---------- หน้ารายการสินค้า ---------- */
export default function Products() {
  const [params, setParams] = useSearchParams();
  const { data: products, loading, error, reload } = useProducts();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = (params.get('q') ?? '').trim();
  const group = params.get('group');
  const category = params.get('category');
  const selectedBrands = params.getAll('brand');
  const min = Number(params.get('min')) || 0;
  const max = Number(params.get('max')) || Infinity;
  const minRating = Number(params.get('rating')) || 0;
  const dealOnly = params.get('deal') === '1';
  const stockOnly = params.get('stock') === '1';
  const sort = params.get('sort') ?? 'featured';
  const page = Math.max(1, Number(params.get('page')) || 1);

  /** แก้ไข query string: ค่า null = ลบ, array = หลายค่า, เปลี่ยนตัวกรองแล้วกลับไปหน้า 1 */
  const update = (patch, { keepPage = false } = {}) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      next.delete(key);
      if (Array.isArray(value)) value.forEach((v) => next.append(key, v));
      else if (value !== null && value !== undefined && value !== '' && !(key === 'sort' && value === 'featured')) {
        next.set(key, value);
      }
    });
    if (!keepPage) next.delete('page');
    setParams(next);
  };

  const clearAll = () => {
    setParams(q ? { q } : {});
    setFiltersOpen(false);
  };

  // สินค้าที่ตรงกับ ค้นหา + หมวดหมู่ (ใช้คำนวณตัวเลือกแบรนด์)
  const scoped = useMemo(() => {
    if (!products) return [];
    const slugs = group ? groupById(group)?.slugs : null;
    const needle = q.toLowerCase();
    return products.filter(
      (p) =>
        (!needle || p.searchText.includes(needle)) &&
        (!slugs || slugs.includes(p.category)) &&
        (!category || p.category === category)
    );
  }, [products, q, group, category]);

  const brands = useMemo(() => {
    const counts = new Map();
    scoped.forEach((p) => p.brand && counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 20);
  }, [scoped]);

  const results = useMemo(() => {
    const list = scoped.filter(
      (p) =>
        p.price >= min &&
        p.price <= max &&
        p.rating >= minRating &&
        (!selectedBrands.length || selectedBrands.includes(p.brand)) &&
        (!dealOnly || p.discount >= 10) &&
        (!stockOnly || p.stock > 0)
    );
    return SORTERS[sort] ? [...list].sort(SORTERS[sort]) : list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scoped, min, max, minRating, params.toString(), dealOnly, stockOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = results.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const title = q
    ? `ผลการค้นหา “${q}”`
    : category
      ? categoryLabel(category)
      : group
        ? groupById(group)?.label ?? 'สินค้าทั้งหมด'
        : dealOnly
          ? 'ดีลเด็ดลดราคา'
          : 'สินค้าทั้งหมด';

  const chips = [
    q && { label: `ค้นหา: ${q}`, clear: () => update({ q: null }) },
    group && { label: groupById(group)?.label, clear: () => update({ group: null }) },
    category && { label: categoryLabel(category), clear: () => update({ category: null }) },
    ...selectedBrands.map((b) => ({ label: b, clear: () => update({ brand: selectedBrands.filter((x) => x !== b) }) })),
    (min || max !== Infinity) && {
      label: `ราคา ${min ? formatPrice(min) : '฿0'} – ${max !== Infinity ? formatPrice(max) : 'ไม่จำกัด'}`,
      clear: () => update({ min: null, max: null }),
    },
    minRating && { label: `${minRating} ดาวขึ้นไป`, clear: () => update({ rating: null }) },
    dealOnly && { label: 'สินค้าลดราคา', clear: () => update({ deal: null }) },
    stockOnly && { label: 'พร้อมส่ง', clear: () => update({ stock: null }) },
  ].filter(Boolean);

  if (error) return <ErrorState title="โหลดสินค้าไม่สำเร็จ" message={error.message} onRetry={reload} />;

  return (
    <div>
      <nav aria-label="breadcrumb" className="mb-4 flex items-center gap-1 text-xs text-neutral-500">
        <Link to="/" className="hover:text-neutral-900">หน้าแรก</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-neutral-900">{title}</span>
      </nav>

      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {!loading && <p className="mt-1 text-sm text-neutral-500">{results.length.toLocaleString('th-TH')} รายการ</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFiltersOpen(true)}
            className="flex items-center gap-2 rounded-full border border-neutral-300 px-4 py-2 text-sm lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> ตัวกรอง
          </button>
          <label htmlFor="sort" className="hidden text-sm text-neutral-600 sm:block">เรียงตาม</label>
          <select
            id="sort"
            value={sort}
            onChange={(event) => update({ sort: event.target.value })}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm outline-none focus:border-brand-700 focus:ring-4 focus:ring-brand-100"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={chip.clear}
              className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-800 hover:bg-brand-100"
            >
              {chip.label} <X className="h-3 w-3" aria-label="ลบตัวกรอง" />
            </button>
          ))}
          <button onClick={clearAll} className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900">
            ล้างทั้งหมด
          </button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-36">
            <FilterPanel params={params} update={update} brands={brands} onClear={clearAll} />
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : pageItems.length === 0 ? (
            <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
              <SearchX className="h-12 w-12 text-neutral-300" aria-hidden="true" />
              <h2 className="text-lg font-semibold">ไม่พบสินค้าที่ตรงกับเงื่อนไข</h2>
              <p className="text-sm text-neutral-500">ลองเปลี่ยนคำค้นหา หรือผ่อนตัวกรองบางรายการ</p>
              <button
                onClick={clearAll}
                className="mt-2 rounded-full bg-brand-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-700"
              >
                ล้างตัวกรอง
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
              <Pagination
                page={safePage}
                totalPages={totalPages}
                onChange={(next) => {
                  update({ page: next }, { keepPage: true });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="ตัวกรองสินค้า"
            className="absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl bg-white"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <h2 className="font-semibold">ตัวกรองสินค้า</h2>
              <button onClick={() => setFiltersOpen(false)} aria-label="ปิด" className="rounded-full p-2 hover:bg-tile">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <FilterPanel params={params} update={update} brands={brands} onClear={clearAll} />
            </div>
            <div className="border-t border-neutral-200 p-4">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-full bg-brand-900 py-3 text-sm font-medium text-white"
              >
                ดู {results.length} รายการ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
