import { create } from "zustand";

interface TradeSidebarStore {
  selectedMarketId: number | null;
  selectedOutcome: 0 | 1 | null;
  selectMarket: (marketId: number, outcome: 0 | 1) => void;
  clearSelection: () => void;
}

export const useTradeSidebarStore = create<TradeSidebarStore>((set) => ({
  selectedMarketId: null,
  selectedOutcome: null,

  selectMarket: (marketId, outcome) =>
    set({ selectedMarketId: marketId, selectedOutcome: outcome }),

  clearSelection: () =>
    set({ selectedMarketId: null, selectedOutcome: null }),
}));
