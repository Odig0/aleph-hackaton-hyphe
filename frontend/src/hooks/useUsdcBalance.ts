"use client";

import { useQuery } from "@tanstack/react-query";
import { useWallet } from "./useWallet";

export function useUsdcBalance() {
  const { connected, address } = useWallet();

  return useQuery({
    queryKey: ["usdc-balance", address],
    queryFn: async (): Promise<string> => {
      if (!address) return "0";
      // Placeholder until real USDC contract read is wired for the selected EVM chain.
      return "0";
    },
    enabled: connected && !!address,
    refetchInterval: 15_000,
  });
}
