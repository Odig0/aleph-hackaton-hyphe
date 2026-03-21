import { create } from "zustand";
import type { VaultInfo, UserVaultInfo } from "@/lib/stellar/types";

interface VaultStore {
  vaultInfo: VaultInfo | null;
  userVaultInfo: UserVaultInfo | null;
  setVaultInfo: (info: VaultInfo) => void;
  setUserVaultInfo: (info: UserVaultInfo) => void;
}

export const useVaultStore = create<VaultStore>((set) => ({
  vaultInfo: null,
  userVaultInfo: null,

  setVaultInfo: (info) => set({ vaultInfo: info }),
  setUserVaultInfo: (info) => set({ userVaultInfo: info }),
}));
