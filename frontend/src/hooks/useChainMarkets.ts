"use client";

import { useQuery } from "@tanstack/react-query";
import { MarketContract, AmmContract } from "@/lib/stellar/contracts";
import { chainToMarket, pricesToOdds } from "@/lib/stellar/parsers";
import { useMarketsStore } from "@/stores/markets";
import type { Market } from "@/lib/stellar/types";

/**
 * Fetch a single market's full data from chain:
 * market_factory.get_market + lmsr_amm.get_prices + lmsr_amm.get_trade_count
 */
async function fetchOneMarketFromChain(marketId: number): Promise<Market> {
  const [info, prices, tradeCount, volume] = await Promise.all([
    MarketContract.getMarketParsed(marketId),
    AmmContract.getPrices(marketId),
    AmmContract.getTradeCount(marketId),
    AmmContract.getVolume(marketId),
  ]);
  return chainToMarket(info, prices, tradeCount, volume);
}

/**
 * Fetch ALL markets from chain.
 * 1. market_factory.market_count() → N
 * 2. For each market 1..N in parallel: get_market + get_prices + get_trade_count
 * 3. Parse into Market[] with real prices
 */
async function fetchAllMarketsFromChain(status?: string): Promise<Market[]> {
  const count = await MarketContract.marketCountParsed();
  if (count === 0) return [];

  const promises = Array.from({ length: count }, (_, i) =>
    fetchOneMarketFromChain(i + 1).catch(() => null),
  );

  const results = await Promise.all(promises);
  let markets = results.filter((m): m is Market => m !== null);

  if (status && status !== "all") {
    markets = markets.filter((m) => m.status === status);
  }

  return markets;
}

/**
 * Hook: read all markets from the blockchain (chain-first).
 * Replaces the old useMarkets that read from the backend API.
 */
export function useChainMarkets(status?: string) {
  const seedOddsFromChain = useMarketsStore((s) => s.seedOddsFromChain);

  return useQuery({
    queryKey: ["chain-markets", status],
    queryFn: async () => {
      const markets = await fetchAllMarketsFromChain(status);
      // Seed Zustand odds store so other components get real prices immediately
      for (const m of markets) {
        seedOddsFromChain(m.id, m.yesPrice, m.noPrice);
      }
      return markets;
    },
    refetchInterval: 15_000,
  });
}

/**
 * Hook: read a single market from the blockchain.
 * Replaces the old useMarket that read from /api/markets/:id.
 */
export function useChainMarket(marketId: number) {
  const seedOddsFromChain = useMarketsStore((s) => s.seedOddsFromChain);

  return useQuery({
    queryKey: ["chain-market", marketId],
    queryFn: async () => {
      const market = await fetchOneMarketFromChain(marketId);
      seedOddsFromChain(market.id, market.yesPrice, market.noPrice);
      return market;
    },
    refetchInterval: 10_000,
  });
}
