"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatUsdc, formatSignedPercent } from "@/lib/utils/format";
import { Sparkles } from "lucide-react";
import type { Position } from "@/lib/stellar/types";

interface PositionCardProps {
  position: Position;
  marketQuestion: string;
  resolved?: boolean;
  won?: boolean;
  onRedeem?: () => void;
  isRedeeming?: boolean;
}

export function PositionCard({
  position,
  marketQuestion,
  resolved,
  won,
  onRedeem,
  isRedeeming,
}: PositionCardProps) {
  const pnl = (position.currentPrice - position.avgEntry) * Number(position.shares);
  const pnlPct = position.avgEntry > 0 ? (position.currentPrice - position.avgEntry) / position.avgEntry : 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card/80 p-5 transition-all duration-300",
        resolved && won
          ? "border-yes/20 bg-yes/[0.03]"
          : resolved && !won
            ? "border-no/20 bg-no/[0.03]"
            : "border-border/50 card-hover",
      )}
    >
      {/* Outcome badge */}
      <div className="mb-3 flex items-start justify-between">
        <p className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight">
          {marketQuestion}
        </p>
        <span
          className={cn(
            "ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider",
            position.outcome === 0
              ? "bg-yes/10 text-yes"
              : "bg-no/10 text-no",
          )}
        >
          {position.outcome === 0 ? "YES" : "NO"}
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Shares
          </p>
          <p className="mt-0.5 text-base font-bold tracking-tight">
            {formatUsdc(position.shares, 0)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Entry
          </p>
          <p className="mt-0.5 font-mono text-base font-bold tracking-tight">
            {position.avgEntry.toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            P&L
          </p>
          <p
            className={cn(
              "mt-0.5 text-base font-bold tracking-tight",
              pnl >= 0 ? "text-yes" : "text-no",
            )}
          >
            {pnl >= 0 ? "+" : ""}${Math.abs(pnl).toFixed(2)}
            <span className="ml-1 text-sm font-semibold opacity-70">
              ({formatSignedPercent(pnlPct)})
            </span>
          </p>
        </div>
      </div>

      {resolved && won && onRedeem && (
        <Button
          onClick={onRedeem}
          disabled={isRedeeming}
          className="btn-depth mt-4 w-full gap-2"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {isRedeeming ? "Redeeming..." : "Redeem Winnings"}
        </Button>
      )}
    </div>
  );
}
