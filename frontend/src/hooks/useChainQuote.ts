"use client";

import { useQuery } from "@tanstack/react-query";
import { AmmContract } from "@/lib/stellar/contracts";
import { i128ToBigInt, priceToFloat } from "@/lib/stellar/parsers";
import { USDC_DECIMALS } from "@/lib/utils/constants";

interface QuoteResult {
  /** USDC cost in raw units (7 decimals) */
  costRaw: bigint;
  /** USDC cost as float */
  costUsdc: number;
  /** Potential payout if outcome wins (shares * 1 USDC in 7 decimals) */
  payoutUsdc: number;
  /** Potential return in USDC */
  returnUsdc: number;
  /** ROI percentage */
  returnPct: number;
  /** Real slippage: (avg price - spot price) / spot price * 100 */
  slippagePct: number;
}

/**
 * Hook: get a real quote from the AMM contract for a buy trade.
 * Replaces the fake linear calculation (amount / price).
 */
export function useChainQuote(
  marketId: number,
  outcome: number,
  shares: bigint,
  enabled: boolean = true,
) {
  return useQuery<QuoteResult | null>({
    queryKey: ["chain-quote", marketId, outcome, shares.toString()],
    queryFn: async () => {
      if (shares <= 0n) return null;

      const [costRaw, spotPriceRaw] = await Promise.all([
        AmmContract.quoteBuyParsed(marketId, outcome, shares),
        AmmContract.getPrices(marketId).then((prices) => prices[outcome] ?? 0n),
      ]);

      const costUsdc = Number(costRaw) / 10 ** USDC_DECIMALS;
      // Payout = shares redeemed at 1 USDC each (shares are in 18-decimal fixed-point)
      const payoutUsdc = Number(shares) / 1e18;
      const returnUsdc = payoutUsdc - costUsdc;
      const returnPct = costUsdc > 0 ? (returnUsdc / costUsdc) * 100 : 0;

      // Slippage: difference between spot price and average execution price
      const spotPrice = priceToFloat(spotPriceRaw);
      const avgPrice = shares > 0n ? costUsdc / (Number(shares) / 1e18) : spotPrice;
      const slippagePct = spotPrice > 0 ? ((avgPrice - spotPrice) / spotPrice) * 100 : 0;

      return {
        costRaw,
        costUsdc,
        payoutUsdc,
        returnUsdc,
        returnPct,
        slippagePct,
      };
    },
    enabled: enabled && shares > 0n,
    staleTime: 5_000,
  });
}
