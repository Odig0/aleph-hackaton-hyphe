"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchVaultInfo, fetchUserVaultInfo } from "@/lib/api/vault";
import { useWallet } from "./useWallet";

export function useVaultInfo() {
  return useQuery({
    queryKey: ["vault-info"],
    queryFn: fetchVaultInfo,
    refetchInterval: 15_000,
  });
}

export function useUserVault() {
  const { address } = useWallet();

  return useQuery({
    queryKey: ["user-vault", address],
    queryFn: () => fetchUserVaultInfo(address!),
    enabled: !!address,
    refetchInterval: 15_000,
  });
}
