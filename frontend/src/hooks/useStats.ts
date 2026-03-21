"use client";

import { useQuery } from "@tanstack/react-query";
import { getMockStats } from "@/lib/mocks/data";

export interface PlatformStats {
  activeMarkets: number;
  totalMarkets: number;
  totalTrades: number;
  trades24h: number;
  /** Raw bigint string (USDC 7 decimals) */
  volume24h: string;
  /** Raw bigint string (USDC 7 decimals) */
  totalVolume: string;
  /** Raw bigint string (USDC 7 decimals) */
  tvl: string;
  timestamp: string;
}

export function useStats() {
  return useQuery<PlatformStats>({
    queryKey: ["platform-stats"],
    queryFn: async () => getMockStats(),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}
