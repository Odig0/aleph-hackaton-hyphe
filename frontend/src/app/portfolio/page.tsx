"use client";

import { useMemo } from "react";
import { Briefcase, Loader2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { EmptyState } from "@/components/shared/EmptyState";
import { useWallet } from "@/hooks/useWallet";
import { useTrade } from "@/hooks/useTrade";
import { usePositions, type ChainPosition } from "@/hooks/usePositions";
import { useMarkets } from "@/hooks/useMarkets";
import { cn } from "@/lib/utils";
import type { Market } from "@/lib/stellar/types";

export default function MyPredictionsPage() {
  const { connected } = useWallet();
  const { redeem, isRedeeming } = useTrade();
  const { data: chainPositions, isLoading: positionsLoading } = usePositions();
  const { data: allMarkets, isLoading: marketsLoading } = useMarkets();

  const isLoading = positionsLoading || marketsLoading;

  // Build a map of marketId → Market for quick lookup
  const marketsMap = useMemo(() => {
    const map = new Map<number, Market>();
    if (allMarkets) {
      for (const m of allMarkets) map.set(m.id, m);
    }
    return map;
  }, [allMarkets]);

  // Group positions by market (YES + NO for same market become one card)
  const groupedPositions = useMemo(() => {
    if (!chainPositions) return [];
    const groups = new Map<number, ChainPosition[]>();
    for (const pos of chainPositions) {
      const existing = groups.get(pos.marketId) ?? [];
      existing.push(pos);
      groups.set(pos.marketId, existing);
    }
    return Array.from(groups.entries()).map(([marketId, positions]) => ({
      marketId,
      market: marketsMap.get(marketId),
      positions,
      totalValue: positions.reduce((sum, p) => sum + p.valueUsdc, 0),
    }));
  }, [chainPositions, marketsMap]);

  if (!connected) {
    return (
      <>
        <div className="mx-auto max-w-[1400px] px-4 pb-8 md:px-8">
          <PageHeader />
          <EmptyState
            icon={Briefcase}
            title="Connect your wallet"
            description="Connect a wallet to see your predictions and earnings."
          />
        </div>
        <Footer />
      </>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-8">
        <Skeleton className="mb-3 h-4 w-24" />
        <Skeleton className="mb-10 h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-36 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="mx-auto max-w-[1000px] px-4 pb-8 md:px-8">
      <PageHeader />

      {groupedPositions.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No predictions yet"
          description="You haven't made any predictions yet. Browse markets to get started."
          actionLabel="Browse Markets"
          actionHref="/markets"
          tips={[
            "Start small — try a $5 trade to learn how it works",
            "Your funds earn yield automatically when you trade",
          ]}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Your Positions
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {groupedPositions.map((group) => (
              <PositionCard
                key={group.marketId}
                marketId={group.marketId}
                market={group.market}
                positions={group.positions}
                totalValue={group.totalValue}
                onRedeem={() => redeem(group.marketId)}
                isRedeeming={isRedeeming}
              />
            ))}
          </div>
        </div>
      )}
    </div>
    <Footer />
    </>
  );
}

function PageHeader() {
  return (
    <div className="py-8 md:py-14">
      <h1 className="text-3xl font-bold tracking-tight">
        My Predictions
      </h1>
      <p className="mt-2 max-w-lg text-base leading-relaxed text-muted-foreground">
        Your positions and earnings in one place.
      </p>
    </div>
  );
}

function PositionCard({
  marketId,
  market,
  positions,
  totalValue,
  onRedeem,
  isRedeeming,
}: {
  marketId: number;
  market?: Market;
  positions: ChainPosition[];
  totalValue: number;
  onRedeem: () => void;
  isRedeeming: boolean;
}) {
  const isResolved = market?.status === "Resolved";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-5 transition-all duration-300 hover:border-primary/20 card-hover">
      <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        <Link
          href={`/markets/${marketId}`}
          className="mb-4 block text-base font-semibold leading-snug tracking-tight transition-colors hover:text-primary"
        >
          {market?.question ?? `Market #${marketId}`}
        </Link>

        <div className="space-y-2">
          {positions.map((pos) => {
            const shares = Number(pos.shares) / 1e18;
            return (
              <div
                key={pos.outcome}
                className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2 text-sm"
              >
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 font-semibold",
                    pos.outcome === 0 ? "text-yes" : "text-no",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      pos.outcome === 0 ? "bg-yes" : "bg-no",
                    )}
                  />
                  {pos.outcome === 0 ? "YES" : "NO"}
                </span>
                <div className="text-right">
                  <span className="font-mono font-bold">
                    {shares.toFixed(2)} shares
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ${pos.valueUsdc.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total value */}
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Position Value</span>
          <span className="font-mono font-bold">${totalValue.toFixed(2)}</span>
        </div>

        {/* Redeem — only for resolved markets */}
        {isResolved && (
          <Button
            onClick={onRedeem}
            disabled={isRedeeming}
            variant="outline"
            size="sm"
            className="mt-4 w-full"
          >
            {isRedeeming ? (
              <>
                <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                Redeeming...
              </>
            ) : (
              "Redeem"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
