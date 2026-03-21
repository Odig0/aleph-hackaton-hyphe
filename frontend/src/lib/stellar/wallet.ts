"use client";

let currentAddress: string | null = null;

export interface WalletState {
  connected: boolean;
  address: string | null;
}

function getInjectedEthereum(): any | null {
  if (typeof window === "undefined") return null;
  // Some browsers expose ethereum directly, others under window.ethereum
  // @ts-ignore
  return (window as any).ethereum ?? null;
}

export async function connectWallet(): Promise<WalletState> {
  const ethereum = getInjectedEthereum();
  if (!ethereum) {
    throw new Error("No injected Ethereum provider found (install MetaMask)");
  }

  // Request account access
  const accounts: string[] = await ethereum.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts returned from wallet");
  }

  currentAddress = accounts[0];
  return { connected: true, address: currentAddress };
}

export async function getAddress(): Promise<string> {
  const ethereum = getInjectedEthereum();
  if (ethereum && ethereum.selectedAddress) {
    return ethereum.selectedAddress;
  }
  if (currentAddress) return currentAddress;
  throw new Error("No address available");
}

export async function signTransaction(xdr: string): Promise<string> {
  // Signing method for Stellar transactions is not implemented for MetaMask.
  // Keep the function to preserve the API surface but throw to signal unsupported operation.
  throw new Error("signTransaction not implemented for Ethereum wallets in this project");
}

export async function signAuthEntry(authEntry: string): Promise<string> {
  throw new Error("signAuthEntry not implemented for Ethereum wallets in this project");
}

export async function disconnectWallet(): Promise<void> {
  currentAddress = null;
}
