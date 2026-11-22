import { CircleCheck, TriangleAlert, X } from 'lucide-react';
import { useToastStore } from '../store/toastStore';

export default function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const Icon = isError ? TriangleAlert : CircleCheck;
        return (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-3 rounded-2xl bg-brand-950 px-4 py-3 text-sm text-white shadow-xl sm:w-auto"
          >
            <Icon
              className={`h-5 w-5 shrink-0 ${isError ? 'text-amber-400' : 'text-emerald-400'}`}
              aria-hidden="true"
            />
            <span className="flex-1">{toast.message}</span>
            {toast.action && (
              <button
                onClick={() => {
                  toast.action.onClick();
                  dismiss(toast.id);
                }}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium transition hover:bg-white/25"
              >
                {toast.action.label}
              </button>
            )}
            <button
              onClick={() => dismiss(toast.id)}
              aria-label="ปิดการแจ้งเตือน"
              className="rounded-full p-1 text-neutral-400 transition hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
