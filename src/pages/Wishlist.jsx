import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import { useWishlistStore } from '../store/wishlistStore';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import ErrorState from '../components/ErrorState';

export default function Wishlist() {
  const ids = useWishlistStore((state) => state.ids);
  const { data: products, loading, error, reload } = useProducts();

  if (error) return <ErrorState title="โหลดสินค้าไม่สำเร็จ" message={error.message} onRetry={reload} />;

  const items = (products ?? []).filter((p) => ids.includes(p.id));

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">รายการโปรด</h1>
      <p className="mb-8 mt-1 text-sm text-neutral-500">{ids.length} รายการ</p>

      {loading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 5 }, (_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
          <Heart className="h-14 w-14 text-neutral-300" aria-hidden="true" />
          <h2 className="text-xl font-semibold">ยังไม่มีสินค้าในรายการโปรด</h2>
          <p className="text-sm text-neutral-500">แตะรูปหัวใจที่สินค้าเพื่อเก็บไว้ดูภายหลัง</p>
          <Link to="/products" className="rounded-full bg-brand-900 px-6 py-3 text-sm font-medium text-white hover:bg-brand-700">
            เลือกดูสินค้า
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4 lg:grid-cols-5">
          {items.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
}
