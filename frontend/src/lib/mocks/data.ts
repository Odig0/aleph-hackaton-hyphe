import type {
  ChainMarketInfo,
  InfoFiSignal,
  Market,
  MarketStatus,
  PlayerValue,
  PriceHistoryPoint,
  TradeEvent,
  UserVaultInfo,
  VaultInfo,
} from "@/lib/stellar/types";

const now = Math.floor(Date.now() / 1000);
const E18 = 10n ** 18n;

const MARKETS: Market[] = [
  {
    id: 1,
    question: "Will Argentina win the 2026 World Cup?",
    category: "World Cup 2026",
    creator: "mock-oracle",
    outcome_tokens: ["YES", "NO"],
    end_time: now + 69 * 86_400,
    status: "Open",
    total_volume: "7420000000",
    liquidity: "3100000000",
    created_at: now - 20 * 86_400,
    trade_count: 33,
    yesPrice: 0.83,
    noPrice: 0.17,
  },
  {
    id: 2,
    question: "Will Brazil reach the 2026 World Cup final?",
    category: "World Cup 2026",
    creator: "mock-oracle",
    outcome_tokens: ["YES", "NO"],
    end_time: now + 95 * 86_400,
    status: "Open",
    total_volume: "6420000000",
    liquidity: "2800000000",
    created_at: now - 28 * 86_400,
    trade_count: 24,
    yesPrice: 0.62,
    noPrice: 0.27,
  },
  {
    id: 3,
    question: "Will France finish first in Group D at World Cup 2026?",
    category: "World Cup 2026",
    creator: "mock-oracle",
    outcome_tokens: ["YES", "NO"],
    end_time: now + 54 * 86_400,
    status: "Open",
    total_volume: "3890000000",
    liquidity: "1750000000",
    created_at: now - 18 * 86_400,
    trade_count: 17,
    yesPrice: 0.57,
    noPrice: 0.43,
  },
  {
    id: 4,
    question: "Will Spain score over 8.5 goals in World Cup 2026?",
    category: "World Cup 2026",
    creator: "mock-oracle",
    outcome_tokens: ["YES", "NO"],
    end_time: now + 120 * 86_400,
    status: "Open",
    total_volume: "2710000000",
    liquidity: "1320000000",
    created_at: now - 10 * 86_400,
    trade_count: 11,
    yesPrice: 0.48,
    noPrice: 0.52,
  },
  {
    id: 5,
    question: "Will Germany keep at least 3 clean sheets at World Cup 2026?",
    category: "World Cup 2026",
    creator: "mock-oracle",
    outcome_tokens: ["YES", "NO"],
    end_time: now + 132 * 86_400,
    status: "Open",
    total_volume: "3150000000",
    liquidity: "1490000000",
    created_at: now - 14 * 86_400,
    trade_count: 13,
    yesPrice: 0.44,
    noPrice: 0.56,
  },
  {
    id: 6,
    question: "Will there be over 165 total goals in World Cup 2026?",
    category: "World Cup 2026",
    creator: "mock-oracle",
    outcome_tokens: ["YES", "NO"],
    end_time: now + 150 * 86_400,
    status: "Open",
    total_volume: "5080000000",
    liquidity: "2200000000",
    created_at: now - 22 * 86_400,
    trade_count: 21,
    yesPrice: 0.69,
    noPrice: 0.31,
  },
];

function createHistoryFromMarket(market: Market): PriceHistoryPoint[] {
  const points = 24;
  const step = 3_600;
  const base = market.yesPrice;

  return Array.from({ length: points }, (_, i) => {
    const noise = Math.sin(i / 2) * 0.015;
    const drift = (i / points) * 0.02 - 0.01;
    const yes = Math.max(0.05, Math.min(0.95, base + noise + drift));
    return {
      time: (now - (points - i) * step) * 1000,
      yes,
      no: 1 - yes,
    };
  });
}

const HISTORY: Record<number, PriceHistoryPoint[]> = Object.fromEntries(
  MARKETS.map((market) => [market.id, createHistoryFromMarket(market)]),
);

const TRADES: Record<number, TradeEvent[]> = Object.fromEntries(
  MARKETS.map((market) => [
    market.id,
    Array.from({ length: 12 }, (_, i) => {
      const side: "buy" | "sell" = i % 3 === 0 ? "sell" : "buy";
      const outcome = i % 2;
      const shares = BigInt(2 + (i % 5)) * E18;
      const price = outcome === 0 ? market.yesPrice : market.noPrice;
      const costUsdc = Number(shares) / 1e18 * price;
      return {
        user: `GMOCKUSER${String(i).padStart(2, "0")}ADDRESSXXXXXXXXXXXXXXXXXXXXXX`,
        marketId: market.id,
        outcome,
        side,
        shares,
        cost: BigInt(Math.round(costUsdc * 1e7)),
        timestamp: (now - i * 2_400) * 1000,
        txHash: `mock-tx-${market.id}-${i}`,
      };
    }),
  ]),
);

const SIGNALS: InfoFiSignal[] = [
  {
    type: "odds_shift",
    marketId: 1,
    marketQuestion: MARKETS[0].question,
    description: "YES moved +6.1% in the last 6h",
    value: 6.1,
    confidence: "high",
    timestamp: Date.now() - 20 * 60_000,
  },
  {
    type: "volume_spike",
    marketId: 2,
    marketQuestion: MARKETS[1].question,
    description: "Volume is 2.1x vs daily average",
    value: 2.1,
    confidence: "medium",
    timestamp: Date.now() - 42 * 60_000,
  },
  {
    type: "momentum",
    marketId: 3,
    marketQuestion: MARKETS[2].question,
    description: "Sustained momentum toward YES in group stage market",
    value: 58,
    confidence: "low",
    timestamp: Date.now() - 75 * 60_000,
  },
];

const PLAYERS: PlayerValue[] = [
  {
    name: "Argentina",
    marketId: 1,
    marginalValue: 0.83,
    change24h: 5.2,
    confidence: "high",
  },
  {
    name: "Brazil",
    marketId: 2,
    marginalValue: 0.62,
    change24h: 1.7,
    confidence: "medium",
  },
  {
    name: "France",
    marketId: 3,
    marginalValue: 0.57,
    change24h: 0.9,
    confidence: "low",
  },
];

const MOMENTUM = MARKETS.map((market) => ({
  marketId: market.id,
  question: market.question,
  momentum: Math.round((market.yesPrice - 0.5) * 200),
}));

const VAULT_INFO: VaultInfo = {
  tvl: "19230000000",
  blendBalance: "13000000000",
  bufferBalance: "6230000000",
  yieldCumulative: "1480000000",
  apyEstimate: 8.6,
  lastUpdated: new Date().toISOString(),
};

export function getMockMarkets(status?: string): Market[] {
  if (!status || status === "all") return MARKETS;
  return MARKETS.filter((m) => m.status === status);
}

export function getMockMarket(marketId: number): Market {
  const market = MARKETS.find((m) => m.id === marketId);
  if (!market) throw new Error(`Market ${marketId} not found`);
  return market;
}

export function getMockMarketHistory(marketId: number): PriceHistoryPoint[] {
  return HISTORY[marketId] ?? [];
}

export function getMockRecentTrades(marketId: number, limit = 20): TradeEvent[] {
  return (TRADES[marketId] ?? []).slice(0, limit);
}

export function getMockSignals(limit = 50): InfoFiSignal[] {
  return SIGNALS.slice(0, limit);
}

export function getMockPlayerValues(): PlayerValue[] {
  return PLAYERS;
}

export function getMockMomentum() {
  return MOMENTUM;
}

export function getMockVaultInfo(): VaultInfo {
  return VAULT_INFO;
}

export function getMockUserVaultInfo(_address: string): UserVaultInfo {
  return {
    deposit: "2500000000",
    pendingYield: "182000000",
  };
}

export function getMockStats() {
  return {
    activeMarkets: MARKETS.filter((m) => m.status === "Open").length,
    totalMarkets: MARKETS.length,
    totalTrades: Object.values(TRADES).reduce((acc, list) => acc + list.length, 0),
    trades24h: 17,
    volume24h: "845000000",
    totalVolume: MARKETS.reduce((acc, m) => acc + BigInt(m.total_volume), 0n).toString(),
    tvl: VAULT_INFO.tvl,
    timestamp: new Date().toISOString(),
  };
}

export function toChainMarketInfo(market: Market): ChainMarketInfo {
  return {
    id: market.id,
    question: market.question,
    category: market.category,
    num_outcomes: 2,
    end_time: market.end_time,
    created_at: market.created_at,
    status: market.status as MarketStatus,
    total_collateral: BigInt(market.total_volume),
    winning_outcome: 0,
    oracle_id: market.creator,
  };
}

export function toPriceBigints(market: Market): bigint[] {
  return [
    BigInt(Math.round(market.yesPrice * 1e18)),
    BigInt(Math.round(market.noPrice * 1e18)),
  ];
}

export function makeMockHash(prefix: string) {
  return `${prefix}-${Math.random().toString(16).slice(2, 14)}`;
}
