import { ChevronLeft, ChevronRight } from 'lucide-react';

function pageWindow(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push('gap');
    result.push(page);
  });
  return result;
}

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const item = 'flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm transition';

  return (
    <nav aria-label="เลือกหน้า" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="หน้าก่อนหน้า"
        className={`${item} hover:bg-tile disabled:opacity-40`}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pageWindow(page, totalPages).map((entry, index) =>
        entry === 'gap' ? (
          <span key={`gap-${index}`} className="px-1 text-neutral-400">
            …
          </span>
        ) : (
          <button
            key={entry}
            onClick={() => onChange(entry)}
            aria-current={entry === page ? 'page' : undefined}
            className={`${item} ${
              entry === page ? 'bg-brand-900 font-medium text-white' : 'hover:bg-tile'
            }`}
          >
            {entry}
          </button>
        )
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="หน้าถัดไป"
        className={`${item} hover:bg-tile disabled:opacity-40`}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
