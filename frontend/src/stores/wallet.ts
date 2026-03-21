import { create } from "zustand";
import { getProvider as getWalletConnectProvider } from "@/lib/walletconnect/config";

type Eip1193Provider = {
  isMetaMask?: boolean;
  _metamask?: unknown;
  isBraveWallet?: boolean;
  isCoinbaseWallet?: boolean;
  isRabby?: boolean;
  isTrust?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
  disconnect?: () => Promise<void>;
};

export interface WalletOption {
  id: string;
  label: string;
  type: "injected" | "walletconnect";
}

function isStrictMetaMask(provider: Eip1193Provider | undefined | null): boolean {
  if (!provider) return false;
  // Use strict checks to avoid providers that spoof `isMetaMask` for compatibility.
  return provider.isMetaMask === true && !!provider._metamask && provider.isBraveWallet !== true;
}

function getInjectedProviders(): Eip1193Provider[] {
  if (typeof window === "undefined") return [];

  const ethereum = (window as any).ethereum as
    | (Eip1193Provider & { providers?: Eip1193Provider[] })
    | undefined;

  if (!ethereum) return [];
  if (Array.isArray(ethereum.providers) && ethereum.providers.length > 0) {
    return ethereum.providers;
  }
  return [ethereum];
}

function getProviderLabel(provider: Eip1193Provider): string {
  if (isStrictMetaMask(provider)) return "MetaMask";
  if (provider.isCoinbaseWallet) return "Coinbase Wallet";
  if (provider.isRabby) return "Rabby";
  if (provider.isTrust) return "Trust Wallet";
  return "Browser Wallet";
}

function getProviderId(provider: Eip1193Provider): string {
  if (isStrictMetaMask(provider)) return "metamask";
  if (provider.isCoinbaseWallet) return "coinbase";
  if (provider.isRabby) return "rabby";
  if (provider.isTrust) return "trust";
  return "injected";
}

function getInjectedMetaMaskProvider(): Eip1193Provider | null {
  if (typeof window === "undefined") return null;

  const ethereum = (window as any).ethereum as
    | (Eip1193Provider & { providers?: Eip1193Provider[] })
    | undefined;

  if (!ethereum) return null;

  // Some wallets expose multiple injected providers. Prefer MetaMask explicitly.
  if (Array.isArray(ethereum.providers) && ethereum.providers.length > 0) {
    const metamask = ethereum.providers.find((p) => isStrictMetaMask(p));
    return metamask ?? null;
  }

  return isStrictMetaMask(ethereum) ? ethereum : null;
}

interface WalletStore {
  connected: boolean;
  address: string | null;
  connecting: boolean;
  error: string | null;
  connect: (walletId?: string) => Promise<void>;
  getWalletOptions: () => WalletOption[];
  disconnect: () => Promise<void>;
}

let activeProvider: Eip1193Provider | null = null;
let activeAccountsChangedHandler: ((...args: unknown[]) => void) | null = null;
let activeDisconnectHandler: ((...args: unknown[]) => void) | null = null;

function cleanupProviderListeners() {
  if (!activeProvider) return;

  if (activeAccountsChangedHandler) {
    activeProvider.removeListener?.("accountsChanged", activeAccountsChangedHandler);
    activeAccountsChangedHandler = null;
  }

  if (activeDisconnectHandler) {
    activeProvider.removeListener?.("disconnect", activeDisconnectHandler);
    activeDisconnectHandler = null;
  }
}

export const useWalletStore = create<WalletStore>((set) => ({
  connected: false,
  address: null,
  connecting: false,
  error: null,

  connect: async (walletId?: string) => {
    set({ connecting: true, error: null });
    try {
      // Avoid duplicated listeners when connect is called multiple times.
      cleanupProviderListeners();

      const injectedProviders = getInjectedProviders();
      let provider: Eip1193Provider | null = null;

      if (walletId === "walletconnect") {
        provider = (await getWalletConnectProvider()) as Eip1193Provider;
      } else {
        if (walletId) {
          provider =
            injectedProviders.find((p) => getProviderId(p) === walletId)
            ?? null;
        }

        // Default preference when no explicit wallet selected.
        if (!provider) {
          provider = getInjectedMetaMaskProvider() ?? injectedProviders[0] ?? null;
        }
      }

      if (!provider) {
        throw new Error(
          "No se encontro wallet en el navegador. Instala MetaMask/Coinbase/Rabby o usa WalletConnect."
        );
      }

      activeProvider = provider;

      const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];

      if (accounts && accounts.length > 0) {
        set({
          connected: true,
          address: accounts[0],
          connecting: false,
        });

        // Setup listeners
        const handleAccountsChanged = (...args: unknown[]) => {
          const newAccounts = (args[0] as string[] | undefined) ?? [];
          if (newAccounts && newAccounts.length > 0) {
            set({ connected: true, address: newAccounts[0] });
          } else {
            set({ connected: false, address: null });
          }
        };

        const handleDisconnect = () => {
          set({ connected: false, address: null });
        };

        activeAccountsChangedHandler = handleAccountsChanged;
        activeDisconnectHandler = handleDisconnect;

        provider.on?.("accountsChanged", handleAccountsChanged);
        provider.on?.("disconnect", handleDisconnect);
      } else {
        set({ connected: false, address: null, connecting: false });
      }
    } catch (err) {
      set({
        connecting: false,
        error: err instanceof Error ? err.message : "Error conectando wallet",
      });
    }
  },

  getWalletOptions: () => {
    const providers = getInjectedProviders();
    const map = new Map<string, WalletOption>();

    for (const provider of providers) {
      const id = getProviderId(provider);
      if (!map.has(id)) {
        map.set(id, {
          id,
          label: getProviderLabel(provider),
          type: "injected",
        });
      }
    }

    // Keep WalletConnect available as cross-device/unsupported browser fallback.
    map.set("walletconnect", {
      id: "walletconnect",
      label: "WalletConnect",
      type: "walletconnect",
    });

    return Array.from(map.values());
  },

  disconnect: async () => {
    try {
      cleanupProviderListeners();

      if (activeProvider?.disconnect) {
        await activeProvider.disconnect();
      }
    } catch (e) {
      console.error("Error desconectando:", e);
    }
    activeProvider = null;
    set({ connected: false, address: null, error: null });
  },
}));
