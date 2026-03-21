import { scValToNative, xdr } from "@stellar/stellar-sdk";
import type { ChainMarketInfo, ChainLmsrState, Market, MarketOdds } from "./types";

/** LMSR uses 18-decimal fixed-point. 1e18 = 1.0 */
const SCALE = 10n ** 18n;

/**
 * Decode an i128 ScVal to bigint.
 */
export function i128ToBigInt(scVal: xdr.ScVal): bigint {
  const i128 = scVal.i128();
  return i128.lo().toBigInt() + (i128.hi().toBigInt() << 64n);
}

/**
 * Convert an i128 LMSR price (18 decimals) to a 0..1 float.
 */
export function priceToFloat(priceBigInt: bigint): number {
  return Number(priceBigInt) / Number(SCALE);
}

/**
 * Parse raw ScVal from get_market() into ChainMarketInfo.
 */
export function parseChainMarket(raw: xdr.ScVal): ChainMarketInfo {
  return scValToNative(raw) as ChainMarketInfo;
}

/**
 * Parse raw ScVal from get_prices() into bigint array.
 */
export function parsePricesVec(raw: xdr.ScVal): bigint[] {
  const vec = raw.vec();
  if (!vec) return [];
  return vec.map((v: xdr.ScVal) => i128ToBigInt(v));
}

/**
 * Parse raw ScVal from get_state_view() into ChainLmsrState.
 */
export function parseLmsrState(raw: xdr.ScVal): ChainLmsrState {
  return scValToNative(raw) as ChainLmsrState;
}

/**
 * Normalize the status field from the chain.
 * Soroban enums may come as plain strings or as { tag: "Open", values: [] }.
 */
export function normalizeStatus(
  status: ChainMarketInfo["status"],
): "Open" | "Closed" | "Resolved" | "Disputed" {
  if (typeof status === "string") {
    return status as "Open" | "Closed" | "Resolved" | "Disputed";
  }
  return (status.tag ?? "Open") as "Open" | "Closed" | "Resolved" | "Disputed";
}

/**
 * Convert ChainMarketInfo + AMM prices + trade_count into the frontend Market type.
 * ALL fields come from on-chain data. Zero DB dependency.
 */
export function chainToMarket(
  info: ChainMarketInfo,
  prices: bigint[],
  tradeCount: number,
  volume?: bigint,
): Market {
  const yesPrice = prices.length > 0 ? priceToFloat(prices[0]) : 0.5;
  const noPrice = prices.length > 1 ? priceToFloat(prices[1]) : 1 - yesPrice;

  return {
    id: Number(info.id),
    question: info.question,
    category: info.category,
    creator: info.oracle_id,
    outcome_tokens: ["YES", "NO"],
    end_time: Number(info.end_time),
    status: normalizeStatus(info.status),
    total_volume: (volume ?? info.total_collateral).toString(),
    liquidity: "0",
    created_at: Number(info.created_at),
    trade_count: tradeCount,
    yesPrice,
    noPrice,
  };
}

/**
 * Extract MarketOdds from raw prices.
 */
export function pricesToOdds(prices: bigint[]): MarketOdds {
  const yes = prices.length > 0 ? priceToFloat(prices[0]) : 0.5;
  const no = prices.length > 1 ? priceToFloat(prices[1]) : 1 - yes;
  return { yes, no };
}
