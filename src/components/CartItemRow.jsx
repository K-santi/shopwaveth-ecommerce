import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import QuantitySelector from './QuantitySelector';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { useUiStore } from '../store/uiStore';
import { categoryLabel } from '../data/catalog';
import { formatPrice, truncate } from '../utils/format';

export default function CartItemRow({ item, compact = false }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const showToast = useToastStore((state) => state.show);
  const closeCart = useUiStore((state) => state.closeCart);

  const handleRemove = () => {
    removeItem(item.id);
    showToast(`นำ ${truncate(item.title, 28)} ออกจากตะกร้าแล้ว`);
  };

  const imageBox = compact ? 'h-20 w-20' : 'h-24 w-24 sm:h-28 sm:w-28';

  return (
    <li className={`flex gap-4 ${compact ? 'py-4' : 'py-6 sm:gap-6'}`}>
      <Link
        to={`/product/${item.id}`}
        onClick={closeCart}
        className={`${imageBox} shrink-0 rounded-xl bg-tile p-2.5`}
      >
        <img src={item.image} alt="" className="h-full w-full object-contain mix-blend-multiply" />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-neutral-500">{categoryLabel(item.category)}</p>
            <Link
              to={`/product/${item.id}`}
              onClick={closeCart}
              className="line-clamp-2 text-sm font-medium hover:underline"
            >
              {item.title}
            </Link>
            {!compact && (
              <p className="mt-1 text-xs text-neutral-500">{formatPrice(item.price)} / ชิ้น</p>
            )}
          </div>
          <p className="shrink-0 text-sm font-semibold tabular-nums text-brand-900">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            max={Math.min(item.stock ?? 20, 20)}
            onChange={(qty) => updateQuantity(item.id, qty)}
          />
          <button
            onClick={handleRemove}
            aria-label={`นำ ${item.title} ออกจากตะกร้า`}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-neutral-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" /> ลบ
          </button>
        </div>
      </div>
    </li>
  );
}
