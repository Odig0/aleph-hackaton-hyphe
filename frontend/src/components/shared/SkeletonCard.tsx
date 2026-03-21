interface SkeletonCardProps {
  delay?: number;
}

export function SkeletonCard({ delay = 0 }: SkeletonCardProps) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl border border-border/50 bg-card/50 p-5"
      style={{ animationDelay: `${delay}s` }}
    >
      {/* Top row: category badge + 24h change */}
      <div className="mb-3 flex items-center justify-between">
        <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
        <div className="h-3 w-10 animate-pulse rounded bg-muted" />
      </div>

      {/* Question lines */}
      <div className="mb-2 h-4 w-[90%] animate-pulse rounded bg-muted" />
      <div className="mb-4 h-4 w-[65%] animate-pulse rounded bg-muted" />

      {/* Price + Sparkline row */}
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="mb-1 h-2.5 w-16 animate-pulse rounded bg-muted/50" />
          <div className="h-6 w-14 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-24 animate-pulse rounded bg-muted/30" />
      </div>

      {/* Yes/No buttons */}
      <div className="grid grid-cols-2 gap-2">
        <div className="h-10 animate-pulse rounded-xl bg-muted/50" />
        <div className="h-10 animate-pulse rounded-xl bg-muted/50" />
      </div>
    </div>
  );
}
