"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeMockHash } from "@/lib/mocks/data";

export function useFaucet() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (address: string) => {
      if (!address) throw new Error("Address required");
      await new Promise((resolve) => setTimeout(resolve, 240));
      return { success: true, hash: makeMockHash("faucet") };
    },
    onSuccess: (_data, address) => {
      queryClient.invalidateQueries({ queryKey: ["usdc-balance", address] });
    },
  });

  return {
    requestFaucet: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}
