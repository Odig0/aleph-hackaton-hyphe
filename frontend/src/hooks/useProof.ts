"use client";

import { useState } from "react";

interface ProofResult {
  proof: string;
  publicInputs: string[];
  commitment: string;
}

interface ProofParams {
  outcome: number;
  amount: bigint;
  balance: bigint;
  marketId: number;
  minAmount: bigint;
  maxOutcomes: number;
}

/**
 * Hook for generating ZK proofs in the browser using noir_js.
 * Lazily loads the prover module to avoid bundle size impact.
 */
export function useProof() {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proof, setProof] = useState<ProofResult | null>(null);

  async function generateProof(params: ProofParams): Promise<ProofResult> {
    setGenerating(true);
    setError(null);
    try {
      // Dynamic import to avoid loading noir_js until needed
      const { generateBetProof, generateSalt } = await import(
        "@/lib/noir/prover"
      );
      const salt = generateSalt();
      const result = await generateBetProof({ ...params, salt });
      setProof(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Proof generation failed";
      setError(message);
      throw err;
    } finally {
      setGenerating(false);
    }
  }

  return { generateProof, generating, error, proof };
}
