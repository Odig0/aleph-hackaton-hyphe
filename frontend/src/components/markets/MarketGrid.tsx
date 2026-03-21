"use client";

import { MarketCard } from "./MarketCard";
import { SkeletonCard } from "@/components/shared/SkeletonCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchX } from "lucide-react";
import { useRevealGroup } from "@/hooks/useReveal";
import type { Market, MarketOdds } from "@/lib/stellar/types";

interface MarketGridProps {
  markets: Market[];
  oddsMap?: Record<number, MarketOdds>;
  loading?: boolean;
  onClearFilters?: () => void;
  onSelectOutcome?: (marketId: number, outcome: 0 | 1) => void;
}

export function MarketGrid({
  markets,
  oddsMap,
  loading,
  onClearFilters,
  onSelectOutcome,
}: MarketGridProps) {
  const groupRef = useRevealGroup(0.1);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} delay={i * 0.1} />
        ))}
      </div>
    );
  }

  if (markets.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No markets found"
        description="Try adjusting your filters or check back later for new markets."
        actionLabel={onClearFilters ? "Clear Filters" : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div ref={groupRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {markets.map((market, i) => (
        <div
          key={market.id}
          className="reveal"
          style={{ transitionDelay: `${i * 100}ms` }}
        >
          <MarketCard market={market} odds={oddsMap?.[market.id]} onSelectOutcome={onSelectOutcome} />
        </div>
      ))}
    </div>
  );
}
