"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallet } from "./useWallet";

export function useUsdcBalance() {
  const { connected, address } = useWallet();

  return useQuery({
    queryKey: ["usdc-balance", address],
    queryFn: async (): Promise<string> => {
      if (!address) return "0";
      return "1250000000";
    },
    enabled: connected && !!address,
    refetchInterval: 15_000,
  });
}
