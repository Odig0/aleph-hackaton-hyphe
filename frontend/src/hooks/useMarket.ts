"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMarketHistory, fetchRecentTrades } from "@/lib/api/markets";

/**
 * Chain-first single market read.
 * Reads directly from smart contracts — no backend DB dependency.
 */
export { useChainMarket as useMarket } from "./useChainMarkets";

/**
 * Historical price data — still from backend API.
 * This is time-series data that doesn't exist on-chain.
 */
export function useMarketHistory(marketId: number) {
  return useQuery({
    queryKey: ["market-history", marketId],
    queryFn: () => fetchMarketHistory(marketId),
    refetchInterval: 30_000,
  });
}

/**
 * Recent trades — still from backend API.
 * Trade events expire from Soroban RPC, so the backend indexes them.
 */
export function useRecentTrades(marketId: number) {
  return useQuery({
    queryKey: ["recent-trades", marketId],
    queryFn: () => fetchRecentTrades(marketId),
    refetchInterval: 5_000,
  });
}
