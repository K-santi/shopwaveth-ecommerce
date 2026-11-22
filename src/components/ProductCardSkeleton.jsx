export default function ProductCardSkeleton({ className = '' }) {
  return (
    <div className={`animate-pulse ${className}`} aria-hidden="true">
      <div className="aspect-square rounded-xl bg-tile" />
      <div className="mt-3 space-y-2">
        <div className="h-3.5 w-full rounded bg-tile" />
        <div className="h-3.5 w-2/3 rounded bg-tile" />
        <div className="h-3 w-1/3 rounded bg-tile" />
        <div className="h-5 w-1/2 rounded bg-tile" />
      </div>
    </div>
  );
}
