import { Link } from 'react-router-dom';
import Rating from './Rating';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import { formatPrice } from '../utils/format';

export default function ProductCard({ product, className = '' }) {
  const hasDiscount = product.discount >= 5;

  return (
    <article className={`group flex flex-col gap-3 ${className}`}>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-tile">
        <Link
          to={`/product/${product.id}`}
          aria-label={product.title}
          className="block h-full w-full p-5"
        >
          <img
            src={product.thumbnail}
            alt=""
            loading="lazy"
            className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-md bg-red-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            -{product.discount}%
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute bottom-2 left-2 rounded-md bg-neutral-800 px-1.5 py-0.5 text-[11px] text-white">
            สินค้าหมด
          </span>
        )}

        <WishlistButton id={product.id} className="absolute right-2 top-2" />
        <AddToCartButton
          variant="icon"
          product={product}
          className="absolute bottom-2 right-2 lg:opacity-0 lg:transition lg:focus-visible:opacity-100 lg:group-hover:opacity-100"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <Link
          to={`/product/${product.id}`}
          className="line-clamp-2 text-[13px] font-medium leading-snug hover:underline"
        >
          {product.title}
        </Link>
        <Rating rate={product.rating} count={product.ratingCount} />
        <p className="mt-auto flex items-baseline gap-2 pt-0.5">
          <span className="text-base font-semibold text-brand-900">{formatPrice(product.price)}</span>
          {hasDiscount && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </p>
      </div>
    </article>
  );
}
