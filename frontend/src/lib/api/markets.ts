import type { Market, PriceHistoryPoint, TradeEvent } from "@/lib/stellar/types";
import {
  getMockMarket,
  getMockMarketHistory,
  getMockMarkets,
  getMockRecentTrades,
} from "@/lib/mocks/data";

export async function fetchMarkets(
  status?: string,
): Promise<Market[]> {
  return getMockMarkets(status);
}

export async function fetchMarket(marketId: number): Promise<Market> {
  return getMockMarket(marketId);
}

export async function fetchMarketHistory(
  marketId: number,
): Promise<PriceHistoryPoint[]> {
  return getMockMarketHistory(marketId);
}

export async function fetchRecentTrades(
  marketId: number,
  limit = 20,
): Promise<TradeEvent[]> {
  return getMockRecentTrades(marketId, limit);
}
