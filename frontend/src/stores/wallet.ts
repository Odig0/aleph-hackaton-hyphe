import { create } from "zustand";
import {
  connectWallet as connectWalletLib,
  type WalletState,
} from "@/lib/stellar/wallet";

interface WalletStore extends WalletState {
  connecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  connected: false,
  address: null,
  connecting: false,
  error: null,

  connect: async () => {
    set({ connecting: true, error: null });
    try {
      const state = await connectWalletLib();
      set({ ...state, connecting: false });
    } catch (err) {
      set({
        connecting: false,
        error: err instanceof Error ? err.message : "Failed to connect wallet",
      });
    }
  },

  disconnect: () => {
    set({ connected: false, address: null, error: null });
  },
}));
