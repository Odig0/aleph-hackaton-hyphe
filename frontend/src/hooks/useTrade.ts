"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AmmContract, MarketContract } from "@/lib/stellar/contracts";
import { useWallet } from "./useWallet";
import type { TxResult } from "@/lib/stellar/transaction";

interface TradeParams {
  marketId: number;
  outcome: number;
  shares: bigint;
}

export function useTrade() {
  const { address } = useWallet();
  const queryClient = useQueryClient();
  const [lastTx, setLastTx] = useState<TxResult | null>(null);

  const buyMutation = useMutation({
    mutationFn: async (params: TradeParams) => {
      if (!address) throw new Error("Wallet not connected");
      return AmmContract.buy(
        address,
        params.marketId,
        params.outcome,
        params.shares,
      );
    },
    onSuccess: (result, params) => {
      setLastTx(result);
      queryClient.invalidateQueries({ queryKey: ["market", params.marketId] });
      queryClient.invalidateQueries({ queryKey: ["recent-trades", params.marketId] });
      queryClient.invalidateQueries({ queryKey: ["user-vault", address] });
    },
  });

  const sellMutation = useMutation({
    mutationFn: async (params: TradeParams) => {
      if (!address) throw new Error("Wallet not connected");
      return AmmContract.sell(
        address,
        params.marketId,
        params.outcome,
        params.shares,
      );
    },
    onSuccess: (result, params) => {
      setLastTx(result);
      queryClient.invalidateQueries({ queryKey: ["market", params.marketId] });
      queryClient.invalidateQueries({ queryKey: ["recent-trades", params.marketId] });
    },
  });

  const redeemMutation = useMutation({
    mutationFn: async (marketId: number) => {
      if (!address) throw new Error("Wallet not connected");
      return MarketContract.redeem(address, marketId);
    },
    onSuccess: (result) => {
      setLastTx(result);
      queryClient.invalidateQueries({ queryKey: ["markets"] });
    },
  });

  return {
    buy: buyMutation.mutateAsync,
    sell: sellMutation.mutateAsync,
    redeem: redeemMutation.mutateAsync,
    isBuying: buyMutation.isPending,
    isSelling: sellMutation.isPending,
    isRedeeming: redeemMutation.isPending,
    lastTx,
    error:
      buyMutation.error || sellMutation.error || redeemMutation.error,
  };
}
