import { Heart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useToastStore } from '../store/toastStore';

export default function WishlistButton({ id, className = '', size = 'sm' }) {
  const active = useWishlistStore((state) => state.ids.includes(id));
  const toggle = useWishlistStore((state) => state.toggle);
  const showToast = useToastStore((state) => state.show);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(id);
    showToast(active ? 'นำออกจากรายการโปรดแล้ว' : 'เพิ่มในรายการโปรดแล้ว');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? 'นำออกจากรายการโปรด' : 'เพิ่มในรายการโปรด'}
      className={`flex items-center justify-center rounded-full bg-white/90 shadow-sm transition hover:bg-white ${
        size === 'md' ? 'h-11 w-11' : 'h-8 w-8'
      } ${className}`}
    >
      <Heart
        className={`${size === 'md' ? 'h-5 w-5' : 'h-4 w-4'} ${
          active ? 'fill-red-500 text-red-500' : 'text-neutral-500'
        }`}
      />
    </button>
  );
}
