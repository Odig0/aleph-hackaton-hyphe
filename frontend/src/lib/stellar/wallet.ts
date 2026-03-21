"use client";

const MOCK_ADDRESS = "GMOCKWALLETADDRESSXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

let currentAddress: string | null = null;

export interface WalletState {
  connected: boolean;
  address: string | null;
}

export async function connectWallet(): Promise<WalletState> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  currentAddress = MOCK_ADDRESS;
  return { connected: true, address: currentAddress };
}

export async function getAddress(): Promise<string> {
  if (!currentAddress) {
    currentAddress = MOCK_ADDRESS;
  }
  return currentAddress;
}

export async function signTransaction(xdr: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return `mock-signed-${xdr}`;
}

export async function signAuthEntry(authEntry: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return `mock-auth-${authEntry}`;
}

export async function disconnectWallet(): Promise<void> {
  currentAddress = null;
}
