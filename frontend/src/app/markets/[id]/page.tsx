"use client";

import { use, useEffect } from "react";
import {
  ArrowLeft,
  BarChart3,
  Activity,
  Database,
  Gavel,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { OddsChart } from "@/components/markets/OddsChart";
import { TradingPanel } from "@/components/markets/TradingPanel";
import { TradeHistory } from "@/components/markets/TradeHistory";
import { Footer } from "@/components/layout/Footer";
import {
  useMarket,
  useMarketHistory,
  useRecentTrades,
} from "@/hooks/useMarket";
import { useOddsStream } from "@/hooks/useOddsStream";
import { useMarketsStore } from "@/stores/markets";
import { formatCompact } from "@/lib/utils/format";
import { USDC_DECIMALS } from "@/lib/utils/constants";

export default function MarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const marketId = parseInt(id, 10);

  const { data: market, isLoading } = useMarket(marketId);
  const { data: history } = useMarketHistory(marketId);
  const { data: trades } = useRecentTrades(marketId);
  const odds = useOddsStream(marketId);

  // Seed odds store from API response so prices show before WebSocket connects
  useEffect(() => {
    if (market?.yesPrice != null) {
      useMarketsStore.getState().updateOdds(marketId, {
        yes: market.yesPrice,
        no: market.noPrice,
      });
    }
  }, [market, marketId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8 md:py-10">
        <Skeleton className="mb-3 h-4 w-32" />
        <Skeleton className="mb-2 h-12 w-full max-w-[600px]" />
        <Skeleton className="mb-10 h-6 w-[300px]" />
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="space-y-6 md:col-span-8">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-[400px] rounded-xl" />
          </div>
          <div className="md:col-span-4">
            <Skeleton className="h-[500px] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!market) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-20 text-center md:px-8">
        <p className="text-lg text-muted-foreground">Market not found.</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-1.5 text-base font-medium text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Markets
        </Link>
      </div>
    );
  }

  const volume = Number(market.total_volume) / 10 ** USDC_DECIMALS;
  const yesPct = Math.round(odds.yes * 100);
  const oracleAddr = market.creator ?? "";

  return (
    <>
      <main className="mx-auto max-w-[1400px] w-full px-4 py-6 md:px-8 md:py-10">
        {/* Breadcrumbs */}
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
          <BarChart3 className="h-3.5 w-3.5" />
          {market.category} &bull; Active Market
        </div>

        {/* HUGE Title */}
        <h1 className="mb-6 max-w-3xl text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
          {market.question}
        </h1>

        {/* Stats row */}
        <div className="mb-10 flex flex-wrap items-center gap-4 md:gap-6">
          <div className="flex flex-col">
            <span className="text-base font-medium text-muted-foreground">
              Current Probability
            </span>
            <span className="text-5xl font-bold tracking-tighter">
              {yesPct}%
            </span>
          </div>
          <div className="mx-2 hidden h-10 w-px bg-border sm:block" />
          <div className="flex flex-col">
            <span className="text-base font-medium text-muted-foreground">
              Market Volume
            </span>
            <span className="text-3xl font-semibold">
              {formatCompact(volume)}
            </span>
          </div>
        </div>

        {/* Grid: 8 + 4 → stacked on mobile */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Left Column */}
          <div className="flex flex-col gap-8 md:col-span-8">
            {/* Chart card */}
            <div className="overflow-hidden rounded-xl border border-border bg-card/30 p-4 md:p-8">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-semibold">
                  <Activity className="h-4 w-4 text-primary" />
                  Market Sentiment (30D)
                </h3>
                <div className="flex rounded-lg border border-border bg-background p-1">
                  {["1H", "1D", "1W", "ALL"].map((label) => (
                    <button
                      key={label}
                      className="rounded-md px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[active]:bg-card data-[active]:text-foreground data-[active]:shadow-sm"
                      data-active={label === "ALL" ? "" : undefined}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[220px] md:h-[320px]">
                <OddsChart data={history ?? []} />
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card/30 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Gavel className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold">Resolution Rules</h3>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Market resolves YES if the event occurs before{" "}
                  <span className="font-medium text-foreground">
                    {new Date(market.end_time * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                  . Resolution is determined by the designated on-chain oracle
                  and verified through the Hyphe protocol.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card/30 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="rounded-lg bg-yes/10 p-2">
                    <Database className="h-5 w-5 text-yes" />
                  </div>
                  <h3 className="font-bold">Oracle Source</h3>
                </div>
                <p className="mb-4 text-base leading-relaxed text-muted-foreground">
                  This market is resolved by the designated oracle address registered on-chain.
                </p>
                <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
                  <span className="font-bold uppercase tracking-wider text-muted-foreground">
                    Oracle Address
                  </span>
                  <span className="rounded bg-primary/10 px-2 py-1 font-mono text-xs text-primary" title={oracleAddr}>
                    {oracleAddr ? `${oracleAddr.slice(0, 6)}...${oracleAddr.slice(-4)}` : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Signals & Activity */}
            {trades && trades.length > 0 && (
              <div className="overflow-hidden rounded-xl border border-border bg-card/30">
                <div className="flex items-center justify-between border-b border-border p-6">
                  <h3 className="flex items-center gap-2 font-bold">
                    <Activity className="h-4 w-4 text-primary" />
                    Social Signals &amp; Activity
                  </h3>
                  <span className="flex items-center gap-1 text-sm font-bold uppercase tracking-widest text-yes">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yes opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-yes" />
                    </span>
                    Live
                  </span>
                </div>
                <div className="p-4">
                  <TradeHistory trades={trades} />
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Smart Trade */}
          <div className="md:col-span-4">
            <TradingPanel marketId={marketId} odds={odds} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
