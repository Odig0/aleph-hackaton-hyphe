"use client";

import { useEffect, useRef } from "react";
import { useMarketsStore } from "@/stores/markets";
import { getMockMarket } from "@/lib/mocks/data";
import type { MarketOdds } from "@/lib/stellar/types";

/**
 * Real-time-ish odds stream powered by local mock data.
 */
export function useOddsStream(marketId: number): MarketOdds {
  const updateOdds = useMarketsStore((s) => s.updateOdds);
  const seedOddsFromChain = useMarketsStore((s) => s.seedOddsFromChain);
  const odds = useMarketsStore((s) => s.oddsMap[marketId]) ?? {
    yes: 0.5,
    no: 0.5,
  };
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    try {
      const market = getMockMarket(marketId);
      seedOddsFromChain(marketId, market.yesPrice, market.noPrice);
    } catch {
      seedOddsFromChain(marketId, 0.5, 0.5);
    }
  }, [marketId, seedOddsFromChain]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      const delta = (Math.random() - 0.5) * 0.02;
      const nextYes = Math.max(0.05, Math.min(0.95, odds.yes + delta));
      updateOdds(marketId, { yes: nextYes, no: 1 - nextYes });
    }, 6000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [marketId, odds.yes, updateOdds]);

  return odds;
}
