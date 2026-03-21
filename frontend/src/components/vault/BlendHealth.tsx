"use client";

import { formatCompact } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

interface BlendHealthProps {
  utilization: number; // 0 to 1
  available: number; // USDC amount
}

export function BlendHealth({ utilization, available }: BlendHealthProps) {
  const pct = Math.round(utilization * 100);
  const isHealthy = pct < 80;
  const isWarning = pct >= 80 && pct < 95;

  return (
    <div className="space-y-4">
      {/* Header with utilization percentage big */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Pool Utilization
          </p>
          <p className={cn(
            "mt-1 text-2xl font-bold tracking-tight",
            isHealthy ? "text-yes" : isWarning ? "text-warning" : "text-no",
          )}>
            {pct}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Available
          </p>
          <p className="mt-1 text-lg font-bold tracking-tight text-foreground">
            {formatCompact(available)}
          </p>
        </div>
      </div>

      {/* Custom progress bar */}
      <div className="relative h-2.5 overflow-hidden rounded-full bg-muted/30">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isHealthy
              ? "bg-gradient-to-r from-yes to-yes/70"
              : isWarning
                ? "bg-gradient-to-r from-warning to-warning/70"
                : "bg-gradient-to-r from-no to-no/70",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
