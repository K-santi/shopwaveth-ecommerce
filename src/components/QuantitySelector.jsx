import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, min = 1, max = 99, size = 'md' }) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const base = `${box} flex items-center justify-center rounded-full transition hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent`;

  return (
    <div className="inline-flex items-center rounded-full border border-neutral-300 bg-white">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="ลดจำนวน"
        className={base}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-medium tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="เพิ่มจำนวน"
        className={base}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
