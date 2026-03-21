"use client";

import { ReactNode } from "react";

interface WalletConnectProviderProps {
  children: ReactNode;
}

export function WalletConnectProvider({ children }: WalletConnectProviderProps) {
  // Provider initialization is handled in the useWalletConnect hook
  return <>{children}</>;
}
