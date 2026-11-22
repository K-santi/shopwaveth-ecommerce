import { RefreshCw, TriangleAlert } from 'lucide-react';

export default function ErrorState({ title = 'เกิดข้อผิดพลาด', message, onRetry }) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-3xl bg-tile px-6 py-14 text-center"
    >
      <TriangleAlert className="h-10 w-10 text-amber-500" aria-hidden="true" />
      <h2 className="text-lg font-semibold">{title}</h2>
      {message && <p className="text-sm text-neutral-500">{message}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> ลองอีกครั้ง
        </button>
      )}
    </div>
  );
}
