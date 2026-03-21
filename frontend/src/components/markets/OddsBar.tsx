"use client";

import { cn } from "@/lib/utils";
import { formatPercent } from "@/lib/utils/format";

interface OddsBarProps {
  yes: number; // 0 to 1
  no: number; // 0 to 1
  className?: string;
  /** Show a larger, more prominent version */
  size?: "sm" | "md";
}

export function OddsBar({ yes, no, className, size = "sm" }: OddsBarProps) {
  const yesWidth = Math.max(5, Math.min(95, yes * 100));
  const isLarge = size === "md";

  return (
    <div className={cn("space-y-2", className)}>
      {/* Labels with values — bigger numbers, smaller labels */}
      <div className="flex items-baseline justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className={cn(
            "font-bold tracking-tight text-yes",
            isLarge ? "text-2xl" : "text-base",
          )}>
            {formatPercent(yes, 0)}
          </span>
          <span className={cn(
            "font-semibold uppercase tracking-wider text-yes/70",
            isLarge ? "text-xs" : "text-xs",
          )}>
            Yes
          </span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className={cn(
            "font-semibold uppercase tracking-wider text-no/70",
            isLarge ? "text-xs" : "text-xs",
          )}>
            No
          </span>
          <span className={cn(
            "font-bold tracking-tight text-no",
            isLarge ? "text-2xl" : "text-base",
          )}>
            {formatPercent(no, 0)}
          </span>
        </div>
      </div>

      {/* Bar — with subtle glow on dominant side */}
      <div className={cn(
        "relative flex overflow-hidden rounded-full",
        isLarge ? "h-3" : "h-2",
      )}>
        {/* Background */}
        <div className="absolute inset-0 bg-muted/50" />

        {/* YES segment */}
        <div
          className="relative rounded-l-full bg-gradient-to-r from-yes to-yes/70 transition-all duration-700 ease-out"
          style={{ width: `${yesWidth}%` }}
        />

        {/* NO segment */}
        <div className="relative flex-1 rounded-r-full bg-gradient-to-r from-no/70 to-no" />
      </div>
    </div>
  );
}
