"use client";

import { useQuery } from "@tanstack/react-query";
import { MarketContract, AmmContract, OutcomeTokenContract } from "@/lib/stellar/contracts";
import { priceToFloat, parseLmsrState } from "@/lib/stellar/parsers";
import { useWallet } from "./useWallet";
import { USDC_DECIMALS } from "@/lib/utils/constants";

export interface ChainPosition {
  marketId: number;
  outcome: number;
  /** Shares in raw 18-decimal fixed-point */
  shares: bigint;
  /** Current price of this outcome (0..1) */
  currentPrice: number;
  /** USDC value of position at current price */
  valueUsdc: number;
}

/**
 * Hook: read user positions directly from outcome_token contract.
 * No backend dependency — 100% on-chain.
 */
export function usePositions() {
  const { address } = useWallet();

  return useQuery<ChainPosition[]>({
    queryKey: ["chain-positions", address],
    queryFn: async () => {
      if (!address) return [];

      const count = await MarketContract.marketCountParsed();
      if (count === 0) return [];

      const positions: ChainPosition[] = [];

      for (let marketId = 1; marketId <= count; marketId++) {
        try {
          const [prices, tradeCount, yesBal, noBal] = await Promise.all([
            AmmContract.getPrices(marketId),
            AmmContract.getTradeCount(marketId),
            OutcomeTokenContract.balance(marketId, 0, address),
            OutcomeTokenContract.balance(marketId, 1, address),
          ]);

          // Skip orphaned tokens: if AMM has 0 trades, any tokens are from
          // a previous AMM deployment and can't be sold on the current one
          if (tradeCount === 0 && (yesBal > 0n || noBal > 0n)) continue;

          const yesPrice = prices.length > 0 ? priceToFloat(prices[0]) : 0.5;
          const noPrice = prices.length > 1 ? priceToFloat(prices[1]) : 0.5;

          if (yesBal > 0n) {
            positions.push({
              marketId,
              outcome: 0,
              shares: yesBal,
              currentPrice: yesPrice,
              valueUsdc: (Number(yesBal) / 1e18) * yesPrice,
            });
          }
          if (noBal > 0n) {
            positions.push({
              marketId,
              outcome: 1,
              shares: noBal,
              currentPrice: noPrice,
              valueUsdc: (Number(noBal) / 1e18) * noPrice,
            });
          }
        } catch {
          // Skip markets that fail
        }
      }

      return positions;
    },
    enabled: !!address,
    refetchInterval: 30_000,
  });
}
