"use client";

import Link from "next/link";
import { formatCompact } from "@/lib/utils/format";
import type { Market, MarketOdds } from "@/lib/stellar/types";
import { USDC_DECIMALS } from "@/lib/utils/constants";

interface MarketCardProps {
  market: Market;
  odds?: MarketOdds;
  onSelectOutcome?: (marketId: number, outcome: 0 | 1) => void;
}

export function MarketCard({ market, odds, onSelectOutcome }: MarketCardProps) {
  const yesPrice = odds?.yes ?? market.yesPrice ?? 0.5;
  const noPrice = odds?.no ?? market.noPrice ?? 0.5;
  const yesPct = Math.round(yesPrice * 100);
  const noPct = Math.round(noPrice * 100);
  const volume = Number(market.total_volume) / 10 ** USDC_DECIMALS;

  return (
    <Link href={`/markets/${market.id}`} className="group block">
      <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50">
        {/* Top row */}
        <div className="mb-3 flex items-start justify-between">
          {market.category && (
            <div className="rounded bg-border/50 px-2 py-0.5 text-xs font-bold uppercase text-muted-foreground">
              {market.category}
            </div>
          )}
          <div className="text-xs font-bold text-muted-foreground">
            {market.trade_count > 0 && (
              <span>{market.trade_count} trades</span>
            )}
          </div>
        </div>

        {/* Question */}
        <h4 className="mb-4 line-clamp-2 min-h-[3.5rem] text-lg font-bold leading-snug text-foreground/90 transition-colors group-hover:text-primary">
          {market.question}
        </h4>

        {/* Price + Volume */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="mb-1 text-sm text-muted-foreground">
              Current Price
            </span>
            <span className="text-2xl font-bold tracking-tight">
              ${yesPrice.toFixed(2)}
            </span>
          </div>
          {volume > 0 && (
            <div className="flex flex-col items-end">
              <span className="mb-1 text-sm text-muted-foreground">Volume</span>
              <span className="text-lg font-semibold">{formatCompact(volume)}</span>
            </div>
          )}
        </div>

        {/* Yes / No buttons */}
        <div className="flex gap-3">
          <button
            onClick={onSelectOutcome ? (e) => { e.preventDefault(); e.stopPropagation(); onSelectOutcome(market.id, 0); } : undefined}
            className="flex-1 rounded-lg bg-border py-3 text-base font-bold text-foreground/80 transition-all hover:bg-yes/20 hover:text-yes md:py-2"
          >
            Yes{" "}
            <span className="font-normal opacity-60">{yesPct}%</span>
          </button>
          <button
            onClick={onSelectOutcome ? (e) => { e.preventDefault(); e.stopPropagation(); onSelectOutcome(market.id, 1); } : undefined}
            className="flex-1 rounded-lg bg-border py-3 text-base font-bold text-foreground/80 transition-all hover:bg-no/20 hover:text-no md:py-2"
          >
            No{" "}
            <span className="font-normal opacity-60">{noPct}%</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
