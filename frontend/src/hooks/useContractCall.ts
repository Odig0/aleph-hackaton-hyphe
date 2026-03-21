"use client";

import { useState } from "react";
import { executeContractCall } from "@/lib/stellar/transaction";
import { useWallet } from "./useWallet";
import type { TxResult } from "@/lib/stellar/transaction";

/**
 * Generic hook for one-off contract calls.
 */
export function useContractCall() {
  const { address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TxResult | null>(null);

  async function execute(
    contractId: string,
    method: string,
    args: unknown[],
  ): Promise<TxResult> {
    if (!address) throw new Error("Wallet not connected");
    setLoading(true);
    setError(null);
    try {
      const txResult = await executeContractCall(
        contractId,
        method,
        args,
        address,
      );
      setResult(txResult);
      return txResult;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Transaction failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { execute, loading, error, result };
}
