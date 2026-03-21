"use client";

import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { cn } from "@/lib/utils";
import { TrendingUp, Layers, Coins } from "lucide-react";

interface PnLSummaryProps {
  totalPnl: number;
  totalPnlPct: number;
  openPositions: number;
  pendingYield: number;
}

export function PnLSummary({
  totalPnl,
  totalPnlPct,
  openPositions,
  pendingYield,
}: PnLSummaryProps) {
  const stats = [
    {
      label: "Total P&L",
      value: totalPnl,
      format: (n: number) =>
        `${n >= 0 ? "+" : ""}$${Math.abs(n).toFixed(2)}`,
      sub: `${totalPnlPct >= 0 ? "+" : ""}${(totalPnlPct * 100).toFixed(1)}%`,
      color: totalPnl >= 0 ? "text-yes" : "text-no",
      icon: TrendingUp,
    },
    {
      label: "Open Positions",
      value: openPositions,
      format: (n: number) => Math.round(n).toString(),
      color: "text-foreground",
      icon: Layers,
    },
    {
      label: "Pending Yield",
      value: pendingYield,
      format: (n: number) => `$${n.toFixed(2)}`,
      color: "text-foreground",
      icon: Coins,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map(({ label, value, format, sub, color, icon: Icon }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-6 transition-all duration-300 hover:border-primary/20 card-hover"
        >
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>

            <AnimatedNumber
              value={value}
              format={format}
              className={cn("text-3xl font-bold tracking-[-0.03em]", color)}
            />

            {sub && (
              <p className={cn("mt-1 text-sm font-semibold", color)}>
                {sub}
              </p>
            )}

            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
