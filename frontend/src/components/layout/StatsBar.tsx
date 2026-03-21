"use client";

import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { formatCompact } from "@/lib/utils/format";
import { USDC_DECIMALS } from "@/lib/utils/constants";
import type { VaultInfo } from "@/lib/stellar/types";
import type { PlatformStats } from "@/hooks/useStats";

interface StatsBarProps {
  vaultInfo?: VaultInfo;
  marketsCount: number;
  /** Total volume computed from chain markets (USDC float) */
  totalVolume?: number;
  /** Backend keeper stats (indexed from on-chain events) */
  stats?: PlatformStats;
}

export function StatsBar({ vaultInfo, marketsCount, totalVolume, stats }: StatsBarProps) {
  const tvl = vaultInfo ? Number(vaultInfo.tvl) / 10 ** USDC_DECIMALS : 0;
  const volume24h = stats ? Number(stats.volume24h) / 10 ** USDC_DECIMALS : 0;
  const totalTrades = stats?.totalTrades ?? 0;

  return (
    <div className="border-b border-border bg-stats-bar">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-2 md:gap-8 md:px-6 md:py-3">
        <div className="flex flex-wrap items-center gap-4 md:gap-8">
          {/* TVL */}
          <div className="flex flex-col">
            <span className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground">
              Total Value Locked
            </span>
            <div className="flex items-center gap-2">
              <AnimatedNumber
                value={tvl}
                format={(n) => formatCompact(n)}
                className="text-base font-bold tabular-nums md:text-xl"
              />
            </div>
          </div>

          <div className="hidden h-8 w-px bg-border md:block" />

          {/* Total Volume — from chain markets */}
          {totalVolume != null && totalVolume > 0 && (
            <>
              <div className="flex flex-col">
                <span className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground">
                  Total Volume
                </span>
                <div className="flex items-center gap-2">
                  <AnimatedNumber
                    value={totalVolume}
                    format={(n) => formatCompact(n)}
                    className="text-base font-bold tabular-nums md:text-xl"
                  />
                </div>
              </div>
              <div className="hidden h-8 w-px bg-border md:block" />
            </>
          )}

          {/* 24h Volume — from backend indexed trades */}
          {volume24h > 0 && (
            <>
              <div className="flex flex-col">
                <span className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground">
                  24h Volume
                </span>
                <div className="flex items-center gap-2">
                  <AnimatedNumber
                    value={volume24h}
                    format={(n) => formatCompact(n)}
                    className="text-base font-bold tabular-nums md:text-xl"
                  />
                </div>
              </div>
              <div className="hidden h-8 w-px bg-border md:block" />
            </>
          )}

          {/* Active Markets */}
          <div className="flex flex-col">
            <span className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground">
              Active Markets
            </span>
            <div className="flex items-center gap-2">
              <AnimatedNumber
                value={marketsCount}
                format={(n) => Math.round(n).toString()}
                className="text-base font-bold tabular-nums md:text-xl"
              />
            </div>
          </div>

          {/* Total Trades — from backend indexed events */}
          {totalTrades > 0 && (
            <>
              <div className="hidden h-8 w-px bg-border md:block" />
              <div className="flex flex-col">
                <span className="mb-1 text-xs font-bold uppercase leading-none tracking-widest text-muted-foreground">
                  Total Trades
                </span>
                <div className="flex items-center gap-2">
                  <AnimatedNumber
                    value={totalTrades}
                    format={(n) => Math.round(n).toString()}
                    className="text-base font-bold tabular-nums md:text-xl"
                  />
                </div>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
