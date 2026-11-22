import { Star } from 'lucide-react';

export default function Rating({ rate = 0, count, size = 'sm' }) {
  const filled = Math.round(rate);
  const star = size === 'md' ? 'h-4 w-4' : 'h-3 w-3';

  return (
    <div
      className="flex items-center gap-1.5 text-[11px] text-neutral-500"
      aria-label={`คะแนน ${rate.toFixed(1)} จาก 5${count != null ? ` จาก ${count} รีวิว` : ''}`}
    >
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`${star} ${i < filled ? 'fill-brand-800 text-brand-800' : 'fill-neutral-200 text-neutral-200'}`}
          />
        ))}
      </span>
      {count != null && <span>({count})</span>}
    </div>
  );
}
