import { useEffect, useState } from 'react';
import { Check, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useToastStore } from '../store/toastStore';
import { useUiStore } from '../store/uiStore';
import { truncate } from '../utils/format';

export default function AddToCartButton({ product, quantity = 1, variant = 'full', className = '' }) {
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.show);
  const openCart = useUiStore((state) => state.openCart);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  useEffect(() => {
    if (!added) return undefined;
    const timer = setTimeout(() => setAdded(false), 1400);
    return () => clearTimeout(timer);
  }, [added]);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const result = addItem(product, quantity);
    if (result === 'capped') {
      showToast('เพิ่มได้ไม่เกินจำนวนสินค้าคงเหลือ', 'error');
    } else {
      showToast(`เพิ่ม ${truncate(product.title, 28)} ลงตะกร้าแล้ว`, 'success', {
        label: 'ดูตะกร้า',
        onClick: openCart,
      });
    }
    setAdded(true);
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={soldOut}
        aria-label={soldOut ? 'สินค้าหมด' : `เพิ่ม ${product.title} ลงตะกร้า`}
        className={`flex h-9 w-9 items-center justify-center rounded-full text-white shadow-md transition active:scale-90 disabled:bg-neutral-300 ${
          added ? 'bg-emerald-600' : 'bg-brand-900 hover:bg-brand-700'
        } ${className}`}
      >
        {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={soldOut}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white transition active:scale-95 disabled:bg-neutral-300 ${
        added ? 'bg-emerald-600' : 'bg-brand-900 hover:bg-brand-700'
      } ${className}`}
    >
      {soldOut ? (
        'สินค้าหมด'
      ) : added ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" /> เพิ่มแล้ว
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" aria-hidden="true" /> เพิ่มลงตะกร้า
        </>
      )}
    </button>
  );
}
