import {
  getMockMarkets,
  getMockRecentTrades,
} from "@/lib/mocks/data";

export interface MarketPosition {
  marketId: number;
  question: string;
  outcomes: {
    outcome: number;
    balance: string;
    totalSupply: string;
  }[];
}

/**
 * Fetch a user's positions in a specific market.
 * Backend route: GET /api/markets/:id/positions/:address
 */
export async function fetchUserMarketPositions(
  marketId: number,
  _address: string,
): Promise<MarketPosition["outcomes"]> {
  const market = getMockMarkets().find((m) => m.id === marketId);
  if (!market) return [];

  return [
    {
      outcome: 0,
      balance: "3000000000000000000",
      totalSupply: "12000000000000000000",
    },
    {
      outcome: 1,
      balance: "1000000000000000000",
      totalSupply: "8000000000000000000",
    },
  ];
}

/**
 * Fetch all user positions across all open markets.
 * Since the backend doesn't have a single endpoint for all positions,
 * we fetch the market list and then query positions for each.
 */
export async function fetchAllUserPositions(
  address: string,
): Promise<MarketPosition[]> {
  const markets = getMockMarkets();

  // Then fetch positions for each market in parallel
  const positionPromises = markets.map(async (market) => {
    try {
      const outcomes = await fetchUserMarketPositions(market.id, address);
      const hasPosition = outcomes.some(
        (o) => BigInt(o.balance) > 0n,
      );
      if (!hasPosition) return null;
      return {
        marketId: market.id,
        question: market.question,
        outcomes,
      };
    } catch {
      return null;
    }
  });

  const results = await Promise.all(positionPromises);
  return results.filter((r): r is MarketPosition => r !== null);
}

/**
 * Fetch trade history for a specific market.
 * Backend route: GET /api/markets/:id/trades
 */
export async function fetchMarketTrades(
  marketId: number,
  limit = 50,
) {
  return getMockRecentTrades(marketId, limit);
}
