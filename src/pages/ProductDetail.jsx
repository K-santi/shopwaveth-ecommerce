import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import useFetch from '../hooks/useFetch';
import useProducts from '../hooks/useProducts';
import { getProduct } from '../services/api';
import { categoryLabel, groupOfCategory } from '../data/catalog';
import { useCartStore } from '../store/cartStore';
import { useRecentStore } from '../store/recentStore';
import Rating from '../components/Rating';
import QuantitySelector from '../components/QuantitySelector';
import AddToCartButton from '../components/AddToCartButton';
import WishlistButton from '../components/WishlistButton';
import ProductRow from '../components/ProductRow';
import ErrorState from '../components/ErrorState';
import { formatDate, formatPrice } from '../utils/format';

function DetailSkeleton() {
  return (
    <div className="grid animate-pulse gap-10 md:grid-cols-2" aria-hidden="true">
      <div className="aspect-square rounded-3xl bg-tile" />
      <div className="space-y-4 py-4">
        <div className="h-3 w-24 rounded bg-tile" />
        <div className="h-8 w-full rounded bg-tile" />
        <div className="h-8 w-2/3 rounded bg-tile" />
        <div className="h-4 w-32 rounded bg-tile" />
        <div className="h-9 w-32 rounded bg-tile" />
        <div className="h-24 w-full rounded bg-tile" />
        <div className="h-12 w-full rounded-full bg-tile" />
      </div>
    </div>
  );
}

function Detail({ product }) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const pushRecent = useRecentStore((state) => state.push);
  const { data: all } = useProducts();

  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [tab, setTab] = useState('description');

  useEffect(() => pushRecent(product.id), [product.id, pushRecent]);

  const maxQty = Math.max(1, Math.min(product.stock, 10));
  const hasDiscount = product.discount >= 5;
  const group = groupOfCategory(product.category);

  const related = useMemo(
    () =>
      (all ?? [])
        .filter((p) => p.category === product.category && p.id !== product.id)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 5),
    [all, product]
  );

  const stockInfo =
    product.stock <= 0
      ? { text: 'สินค้าหมด', tone: 'text-red-600' }
      : product.stock <= 10
        ? { text: `เหลือเพียง ${product.stock} ชิ้น`, tone: 'text-amber-600' }
        : { text: 'มีสินค้าพร้อมส่ง', tone: 'text-emerald-600' };

  const buyNow = () => {
    addItem(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="space-y-12">
      <div>
        <nav aria-label="breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-neutral-500">
          <Link to="/" className="hover:text-neutral-900">หน้าแรก</Link>
          <ChevronRight className="h-3 w-3" />
          {group && (
            <>
              <Link to={`/products?group=${group.id}`} className="hover:text-neutral-900">{group.label}</Link>
              <ChevronRight className="h-3 w-3" />
            </>
          )}
          <Link to={`/products?category=${product.category}`} className="hover:text-neutral-900">
            {categoryLabel(product.category)}
          </Link>
        </nav>

        <div className="grid gap-8 md:grid-cols-2 md:gap-14">
          {/* แกลเลอรี */}
          <div className="space-y-3">
            <div className="relative flex aspect-square items-center justify-center rounded-3xl bg-tile p-8 sm:p-12">
              <img
                src={product.images[imageIndex]}
                alt={product.title}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-lg bg-red-600 px-2.5 py-1 text-sm font-semibold text-white">
                  -{product.discount}%
                </span>
              )}
              <WishlistButton id={product.id} size="md" className="absolute right-4 top-4" />
            </div>
            {product.images.length > 1 && (
              <ul className="no-scrollbar flex gap-3 overflow-x-auto">
                {product.images.map((src, index) => (
                  <li key={src}>
                    <button
                      onClick={() => setImageIndex(index)}
                      aria-label={`ดูรูปที่ ${index + 1}`}
                      aria-current={index === imageIndex}
                      className={`h-20 w-20 shrink-0 rounded-xl bg-tile p-2 ring-2 transition ${
                        index === imageIndex ? 'ring-brand-800' : 'ring-transparent hover:ring-neutral-300'
                      }`}
                    >
                      <img src={src} alt="" className="h-full w-full object-contain mix-blend-multiply" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ข้อมูลสินค้า */}
          <div className="flex flex-col gap-5 md:py-2">
            {product.brand && (
              <Link
                to={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="w-fit text-xs font-medium uppercase tracking-widest text-brand-700 hover:underline"
              >
                {product.brand}
              </Link>
            )}
            <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{product.title}</h1>
            <div className="flex items-center gap-3">
              <Rating rate={product.rating} count={product.ratingCount} size="md" />
              <span className="text-sm text-neutral-500">{product.rating.toFixed(1)} / 5</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <p className="text-3xl font-semibold text-brand-900">{formatPrice(product.price)}</p>
              {hasDiscount && (
                <p className="text-lg text-neutral-400 line-through">{formatPrice(product.originalPrice)}</p>
              )}
            </div>
            <p className={`text-sm font-medium ${stockInfo.tone}`}>{stockInfo.text}</p>

            {product.tags.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      to={`/products?q=${encodeURIComponent(tag)}`}
                      className="rounded-full bg-tile px-3 py-1 text-xs text-neutral-600 hover:bg-brand-50 hover:text-brand-800"
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <QuantitySelector value={quantity} onChange={setQuantity} max={maxQty} />
              <AddToCartButton product={product} quantity={quantity} className="flex-1 sm:flex-none sm:px-8" />
              <button
                onClick={buyNow}
                disabled={product.stock <= 0}
                className="flex-1 rounded-full border border-brand-900 px-8 py-3 text-sm font-medium text-brand-900 transition hover:bg-brand-50 disabled:opacity-40 sm:flex-none"
              >
                ซื้อเลย
              </button>
            </div>

            <ul className="mt-2 space-y-3 border-t border-neutral-200 pt-5 text-sm text-neutral-600">
              <li className="flex items-center gap-3"><Truck className="h-5 w-5 text-brand-700" /> ส่งฟรีเมื่อซื้อครบ ฿999</li>
              <li className="flex items-center gap-3"><RotateCcw className="h-5 w-5 text-brand-700" /> คืนสินค้าได้ภายใน 30 วัน</li>
              <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-700" /> รับประกันสินค้าแท้ 100%</li>
            </ul>
          </div>
        </div>
      </div>

      {/* แท็บรายละเอียด / รีวิว */}
      <section>
        <div role="tablist" className="flex gap-6 border-b border-neutral-200">
          {[
            { id: 'description', label: 'รายละเอียดสินค้า' },
            { id: 'reviews', label: `รีวิว (${product.ratingCount})` },
          ].map((item) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium transition ${
                tab === item.id ? 'border-brand-900 text-brand-900' : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'description' ? (
          <div className="grid gap-8 pt-6 md:grid-cols-3">
            <p className="leading-relaxed text-neutral-700 md:col-span-2">{product.description}</p>
            <dl className="space-y-2 rounded-2xl bg-tile p-5 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-neutral-500">รหัสสินค้า</dt><dd>{product.sku}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-neutral-500">หมวดหมู่</dt><dd>{categoryLabel(product.category)}</dd></div>
              {product.brand && (
                <div className="flex justify-between gap-4"><dt className="text-neutral-500">แบรนด์</dt><dd>{product.brand}</dd></div>
              )}
              <div className="flex justify-between gap-4"><dt className="text-neutral-500">คงเหลือ</dt><dd>{product.stock} ชิ้น</dd></div>
            </dl>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100 pt-2">
            {product.reviews.length === 0 && (
              <li className="py-8 text-center text-sm text-neutral-500">ยังไม่มีรีวิวสำหรับสินค้านี้</li>
            )}
            {product.reviews.map((review) => (
              <li key={`${review.reviewerEmail}-${review.date}`} className="space-y-2 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800">
                      {review.reviewerName.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{review.reviewerName}</p>
                      <Rating rate={review.rating} />
                    </div>
                  </div>
                  <time className="text-xs text-neutral-400" dateTime={review.date}>{formatDate(review.date)}</time>
                </div>
                <p className="text-sm text-neutral-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <ProductRow title="สินค้าที่คล้ายกัน" to={`/products?category=${product.category}`} products={related} />
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { data: product, loading, error, reload } = useFetch(() => getProduct(id), id);

  if (loading) return <DetailSkeleton />;
  if (error) {
    return (
      <ErrorState
        title="ไม่สามารถแสดงสินค้านี้ได้"
        message={error.message}
        onRetry={reload}
      />
    );
  }
  // key ทำให้ state ภายใน (จำนวน, รูปที่เลือก) รีเซ็ตเมื่อเปลี่ยนสินค้า
  return <Detail key={product.id} product={product} />;
}
