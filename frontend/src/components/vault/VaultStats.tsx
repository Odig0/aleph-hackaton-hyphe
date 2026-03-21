"use client";

import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { formatCompact, formatPercent } from "@/lib/utils/format";
import { USDC_DECIMALS } from "@/lib/utils/constants";
import { Vault, TrendingUp, Coins } from "lucide-react";

interface VaultStatsProps {
  tvl: string;
  apy: number;
  totalYield: string;
}

export function VaultStats({ tvl, apy, totalYield }: VaultStatsProps) {
  const tvlNum = Number(tvl) / 10 ** USDC_DECIMALS;
  const yieldNum = Number(totalYield) / 10 ** USDC_DECIMALS;

  const stats = [
    {
      label: "Total Value Locked",
      value: tvlNum,
      format: (n: number) => formatCompact(n),
      icon: Vault,
      accent: "text-primary",
    },
    {
      label: "APY",
      value: apy,
      format: (n: number) => formatPercent(n),
      icon: TrendingUp,
      accent: "text-yes",
    },
    {
      label: "Yield Generated",
      value: yieldNum,
      format: (n: number) => formatCompact(n),
      icon: Coins,
      accent: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map(({ label, value, format, icon: Icon, accent }) => (
        <div
          key={label}
          className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-6 transition-all duration-300 hover:border-primary/20 card-hover"
        >
          {/* Decorative gradient on hover */}
          <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="relative">
            {/* Icon */}
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>

            {/* Value — BIG */}
            <AnimatedNumber
              value={value}
              format={format}
              className={`text-3xl font-bold tracking-[-0.03em] ${accent}`}
            />

            {/* Label — tiny */}
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
