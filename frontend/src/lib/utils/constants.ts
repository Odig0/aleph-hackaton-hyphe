export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || "mock";
export const HORIZON_URL = "";
export const SOROBAN_RPC_URL = "";
export const NETWORK_PASSPHRASE = "mock";

export const CONTRACTS = {
  factory: process.env.NEXT_PUBLIC_FACTORY_CONTRACT!,
  vault: process.env.NEXT_PUBLIC_VAULT_CONTRACT!,
  amm: process.env.NEXT_PUBLIC_AMM_CONTRACT!,
  outcomeToken: process.env.NEXT_PUBLIC_OUTCOME_TOKEN_CONTRACT!,
  oracle: process.env.NEXT_PUBLIC_ORACLE_CONTRACT!,
  usdcSac: process.env.NEXT_PUBLIC_USDC_SAC!,
} as const;

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "";
export const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL || "";

// USDC decimals
export const USDC_DECIMALS = 7;
export const USDC_MULTIPLIER = 10n ** BigInt(USDC_DECIMALS);

// Transaction defaults
export const DEFAULT_FEE = "100";
export const DEFAULT_TIMEOUT = 30;

export const EXPLORER_URL = "";
