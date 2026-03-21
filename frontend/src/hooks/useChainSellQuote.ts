"use client";

import { useQuery } from "@tanstack/react-query";
import { AmmContract } from "@/lib/stellar/contracts";
import { priceToFloat } from "@/lib/stellar/parsers";
import { USDC_DECIMALS } from "@/lib/utils/constants";

interface SellQuoteResult {
  /** USDC refund as float */
  refundUsdc: number;
  /** Real slippage: (spot price - avg price) / spot price * 100 */
  slippagePct: number;
}

/**
 * Hook: get a real quote from the AMM contract for a sell trade.
 * Input is shares (18-decimal bigint), returns USDC refund.
 */
export function useChainSellQuote(
  marketId: number,
  outcome: number,
  shares: bigint,
  enabled: boolean = true,
) {
  return useQuery<SellQuoteResult | null>({
    queryKey: ["chain-sell-quote", marketId, outcome, shares.toString()],
    queryFn: async () => {
      if (shares <= 0n) return null;

      const [refundRaw, spotPriceRaw] = await Promise.all([
        AmmContract.quoteSellParsed(marketId, outcome, shares),
        AmmContract.getPrices(marketId).then((prices) => prices[outcome] ?? 0n),
      ]);

      const refundUsdc = Number(refundRaw) / 10 ** USDC_DECIMALS;

      // Slippage: difference between spot price and average execution price
      const spotPrice = priceToFloat(spotPriceRaw);
      const sharesFloat = Number(shares) / 1e18;
      const avgPrice = sharesFloat > 0 ? refundUsdc / sharesFloat : spotPrice;
      const slippagePct = spotPrice > 0 ? ((spotPrice - avgPrice) / spotPrice) * 100 : 0;

      return {
        refundUsdc,
        slippagePct,
      };
    },
    enabled: enabled && shares > 0n,
    staleTime: 5_000,
  });
}
