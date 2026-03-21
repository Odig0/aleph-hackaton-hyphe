"use client";

import { useWalletStore } from "@/stores/wallet";

/**
 * Hook for wallet state and actions.
 * Wraps the Zustand store for convenient use in components.
 */
export function useWallet() {
  const { connected, address, connecting, error, connect, disconnect, getWalletOptions } =
    useWalletStore();

  return {
    connected,
    address,
    connecting,
    error,
    connect,
    getWalletOptions,
    disconnect,
  };
}
