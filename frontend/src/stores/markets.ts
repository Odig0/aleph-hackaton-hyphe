import { create } from "zustand";
import type { Market, MarketOdds } from "@/lib/stellar/types";

interface MarketsStore {
  markets: Market[];
  oddsMap: Record<number, MarketOdds>;
  setMarkets: (markets: Market[]) => void;
  updateOdds: (marketId: number, odds: MarketOdds) => void;
  /** Seed odds from chain read — only sets if no odds exist yet (won't overwrite WS updates) */
  seedOddsFromChain: (marketId: number, yes: number, no: number) => void;
}

export const useMarketsStore = create<MarketsStore>((set) => ({
  markets: [],
  oddsMap: {},

  setMarkets: (markets) => set({ markets }),

  updateOdds: (marketId, odds) =>
    set((state) => ({
      oddsMap: { ...state.oddsMap, [marketId]: odds },
    })),

  seedOddsFromChain: (marketId, yes, no) =>
    set((state) => ({
      oddsMap: {
        ...state.oddsMap,
        [marketId]: state.oddsMap[marketId] ?? { yes, no },
      },
    })),
}));
