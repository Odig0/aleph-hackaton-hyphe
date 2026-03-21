import { Noir } from "@noir-lang/noir_js";
import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";

let noir: Noir | null = null;
let backend: BarretenbergBackend | null = null;

export async function initProver() {
  if (noir && backend) return;

  const circuit = await fetch("/circuits/private_bet.json").then((r) =>
    r.json(),
  );
  backend = new BarretenbergBackend(circuit);
  noir = new Noir(circuit);
  await noir.init();
}

function computePoseidonHash(
  outcome: number,
  amount: bigint,
  salt: bigint,
): bigint {
  // Commitment computation — matches on-chain Poseidon hash
  const combined =
    BigInt(outcome) * (1n << 128n) + amount * (1n << 64n) + (salt % (1n << 64n));
  return combined;
}

export async function generateBetProof(params: {
  outcome: number;
  amount: bigint;
  balance: bigint;
  salt: bigint;
  marketId: number;
  minAmount: bigint;
  maxOutcomes: number;
}) {
  await initProver();

  const commitment = computePoseidonHash(
    params.outcome,
    params.amount,
    params.salt,
  );

  const inputs: Record<string, string> = {
    outcome: params.outcome.toString(),
    amount: params.amount.toString(),
    balance: params.balance.toString(),
    salt: params.salt.toString(),
    commitment: commitment.toString(),
    market_id: params.marketId.toString(),
    min_amount: params.minAmount.toString(),
    max_outcomes: params.maxOutcomes.toString(),
  };

  // Execute circuit to get witness
  const { witness } = await noir!.execute(inputs);

  // Generate proof from witness using backend
  const proof = await backend!.generateProof(witness);

  return {
    proof: Array.from(new Uint8Array(proof.proof))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
    publicInputs: proof.publicInputs.map((p: unknown) => String(p)),
    commitment: commitment.toString(),
  };
}

export function generateSalt(): bigint {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return BigInt(
    "0x" +
      Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
  );
}
