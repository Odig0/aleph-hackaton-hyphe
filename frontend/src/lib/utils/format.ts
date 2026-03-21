import { formatDistanceToNow, format } from "date-fns";
import Decimal from "decimal.js";
import { USDC_DECIMALS } from "./constants";

/**
 * Format a raw USDC bigint (7 decimals) to a human-readable string.
 * e.g. 12345000000n → "1,234.50"
 */
export function formatUsdc(raw: bigint, decimals = 2): string {
  const d = new Decimal(raw.toString()).div(new Decimal(10).pow(USDC_DECIMALS));
  return d.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Parse a user-entered USDC string into raw bigint (7 decimals).
 * e.g. "12.50" → 125000000n
 */
export function parseUsdc(amount: string): bigint {
  const d = new Decimal(amount).mul(new Decimal(10).pow(USDC_DECIMALS));
  return BigInt(d.toFixed(0));
}

/**
 * Format large numbers compactly.
 * e.g. 2400000 → "$2.4M", 45200 → "$45.2K"
 */
export function formatCompact(value: number, prefix = "$"): string {
  if (value >= 1_000_000) {
    return `${prefix}${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${prefix}${(value / 1_000).toFixed(1)}K`;
  }
  return `${prefix}${value.toFixed(2)}`;
}

/**
 * Format a percentage. e.g. 0.352 → "35.2%"
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a signed percentage with + prefix. e.g. 0.023 → "+2.3%"
 */
export function formatSignedPercent(value: number, decimals = 1): string {
  const pct = (value * 100).toFixed(decimals);
  return value >= 0 ? `+${pct}%` : `${pct}%`;
}

/**
 * Truncate a Stellar address. e.g. GABCD...WXYZ
 */
export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format a Unix timestamp to relative time. e.g. "23d left"
 */
export function formatTimeLeft(endTime: number): string {
  const now = Date.now() / 1000;
  if (endTime <= now) return "Ended";
  return formatDistanceToNow(new Date(endTime * 1000), { addSuffix: false });
}

/**
 * Format a Unix timestamp to a date string.
 */
export function formatDate(timestamp: number): string {
  return format(new Date(timestamp * 1000), "MMM d, yyyy");
}

/**
 * Format a Unix timestamp to a datetime string.
 */
export function formatDateTime(timestamp: number): string {
  return format(new Date(timestamp * 1000), "MMM d, yyyy h:mm a");
}
