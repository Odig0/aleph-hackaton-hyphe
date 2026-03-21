"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronDown,
  BarChart3,
  ArrowRight,
  Users,
  X,
  Wallet,
  Loader2,
  ExternalLink,
  Globe,
  SlidersHorizontal,
} from "lucide-react";
import { MarketGrid } from "@/components/markets/MarketGrid";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsBar } from "@/components/layout/StatsBar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { PresetAmounts } from "@/components/shared/PresetAmounts";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { txPending, txSuccess, txError } from "@/components/shared/TxToast";
import { useMarkets } from "@/hooks/useMarkets";
import { useMarketsStore } from "@/stores/markets";
import { useTradeSidebarStore } from "@/stores/tradeSidebar";
import { useVaultInfo } from "@/hooks/useVault";
import { useWallet } from "@/hooks/useWallet";
import { useTrade } from "@/hooks/useTrade";
import { usePositions } from "@/hooks/usePositions";
import { useChainQuote } from "@/hooks/useChainQuote";
import { useStats } from "@/hooks/useStats";
import { formatCompact } from "@/lib/utils/format";
import { USDC_DECIMALS } from "@/lib/utils/constants";
import Decimal from "decimal.js";
import { detectCountries } from "@/lib/utils/countryMarkets";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { WorldMap } from "@/components/shared/WorldMap";
import type { Market, MarketOdds } from "@/lib/stellar/types";

/* ────────────────────────────────────────────────────────────────
   Featured Market Hero
   ──────────────────────────────────────────────────────────────── */
function FeaturedMarketHero({
  market,
  odds,
}: {
  market: Market;
  odds?: MarketOdds;
}) {
  const yesPrice = odds?.yes ?? market.yesPrice ?? 0.5;
  const noPrice = odds?.no ?? market.noPrice ?? 0.5;
  const volume = Number(market.total_volume) / 10 ** USDC_DECIMALS;
  const daysLeft = Math.max(
    0,
    Math.ceil((market.end_time - Date.now() / 1000) / 86400),
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card group">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full opacity-30 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.27 280 / 0.6), transparent 70%)",
        }}
      />

      <div className="relative z-20 flex max-w-2xl flex-col justify-center p-4 md:p-8">
        {/* Badges */}
        <div className="mb-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Featured
          </span>
          {market.status === "Open" && daysLeft > 0 && (
            <span className="text-sm font-medium text-muted-foreground">
              Ends in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="mb-4 text-xl font-extrabold leading-tight text-white sm:text-2xl md:text-3xl">
          {market.question}
        </h2>

        {/* Odds bar */}
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-yes">
            <span className="h-2 w-2 rounded-full bg-yes" /> Yes{" "}
            {Math.round(yesPrice * 100)}%
          </span>
          <span className="flex items-center gap-1.5 font-bold text-no">
            No {Math.round(noPrice * 100)}%{" "}
            <span className="h-2 w-2 rounded-full bg-no" />
          </span>
        </div>
        <div className="mb-8 flex h-3 w-full overflow-hidden rounded-full">
          <div
            className="bg-yes"
            style={{
              width: `${yesPrice * 100}%`,
              boxShadow: "0 0 15px oklch(0.66 0.19 160 / 0.4)",
            }}
          />
          <div
            className="flex-1 bg-no"
            style={{
              boxShadow: "0 0 15px oklch(0.63 0.24 15 / 0.4)",
            }}
          />
        </div>

        {/* Trade buttons */}
        <div className="mb-8 flex items-center gap-4">
          <Link
            href={`/markets/${market.id}`}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-yes text-lg font-bold text-white shadow-lg shadow-yes/20 transition-transform active:scale-[0.98] hover:bg-yes/90 md:h-14"
          >
            Trade Yes{" "}
            <span className="text-sm font-normal opacity-80">
              ${yesPrice.toFixed(2)}
            </span>
          </Link>
          <Link
            href={`/markets/${market.id}`}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-no text-lg font-bold text-white shadow-lg shadow-no/20 transition-transform active:scale-[0.98] hover:bg-no/90 md:h-14"
          >
            Trade No{" "}
            <span className="text-sm font-normal opacity-80">
              ${noPrice.toFixed(2)}
            </span>
          </Link>
        </div>

        {/* Footer stats */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            {formatCompact(volume)} Volume
          </span>
          <span className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
            <Users className="h-4 w-4" />
            {market.trade_count ?? 0} Trades
          </span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Home Sidebar — Betslip / Personal Summary
   ──────────────────────────────────────────────────────────────── */
function HomeSidebar({
  markets,
  oddsMap,
}: {
  markets: Market[];
  oddsMap: Record<number, MarketOdds>;
}) {
  const { connected, address, connect } = useWallet();
  const { buy, isBuying } = useTrade();
  const { selectedMarketId, selectedOutcome, clearSelection } =
    useTradeSidebarStore();

  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  // Fetch user positions directly from chain (no backend dependency)
  const { data: chainPositions } = usePositions();

  // Find selected market data
  const selectedMarket = selectedMarketId
    ? markets.find((m) => m.id === selectedMarketId) ?? null
    : null;
  const selectedOdds = selectedMarketId ? oddsMap[selectedMarketId] : undefined;

  const outcome: 0 | 1 = selectedOutcome ?? 0;
  const currentOdds = selectedOdds
    ? outcome === 0
      ? selectedOdds.yes
      : selectedOdds.no
    : 0.5;
  const parsedAmount = parseFloat(amount) || 0;

  // Convert USDC amount → shares for chain quote
  const shares = useMemo(() => {
    if (parsedAmount <= 0 || currentOdds <= 0) return 0n;
    return BigInt(
      new Decimal(amount || "0").div(Math.max(currentOdds, 0.01)).mul("1000000000000000000").toFixed(0)
    );
  }, [amount, parsedAmount, currentOdds]);

  // Get real quote from AMM contract
  const { data: sidebarQuote } = useChainQuote(
    selectedMarketId ?? 0,
    outcome,
    shares,
    !!selectedMarketId && parsedAmount > 0,
  );

  function handlePresetSelect(preset: number) {
    setSelectedPreset(preset);
    setAmount(preset.toString());
  }

  function handleOutcomeToggle(o: 0 | 1) {
    useTradeSidebarStore
      .getState()
      .selectMarket(selectedMarketId!, o);
  }

  async function handleTrade() {
    if (!connected) {
      connect();
      return;
    }
    if (!selectedMarketId || !amount || parsedAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    // Convert USDC amount → shares in 18-decimal fixed-point (same as TradingPanel)
    const price = outcome === 0
      ? (selectedOdds?.yes ?? 0.5)
      : (selectedOdds?.no ?? 0.5);
    const shares = BigInt(
      new Decimal(amount).div(Math.max(price, 0.01)).mul("1000000000000000000").toFixed(0)
    );
    const toastId = txPending(
      `Buying ${outcome === 0 ? "YES" : "NO"}...`,
    );
    try {
      const result = await buy({
        marketId: selectedMarketId,
        outcome,
        shares,
      });
      toast.dismiss(toastId);
      txSuccess(
        result.hash,
        `Bought ${outcome === 0 ? "YES" : "NO"} tokens`,
      );
      setAmount("");
      setSelectedPreset(null);
      clearSelection();
    } catch (err) {
      toast.dismiss(toastId);
      txError(err instanceof Error ? err.message : "Transaction failed");
    }
  }

  // ── Trading Panel (market selected) ──────────────────────────
  if (selectedMarket) {
    const yesPct = selectedOdds ? Math.round(selectedOdds.yes * 100) : 50;
    const noPct = selectedOdds ? Math.round(selectedOdds.no * 100) : 50;

    return (
      <aside className="hidden w-80 shrink-0 flex-col border-l border-border xl:flex">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border p-5">
          <Link
            href={`/markets/${selectedMarket.id}`}
            className="text-sm font-bold leading-snug text-foreground/90 hover:text-primary transition-colors line-clamp-2"
          >
            {selectedMarket.question}
          </Link>
          <button
            onClick={clearSelection}
            className="mt-0.5 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto p-5">
          {/* Outcome toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleOutcomeToggle(0)}
              className={cn(
                "rounded-xl border-2 py-3 text-center font-bold transition-all",
                outcome === 0
                  ? "border-yes bg-yes/10 text-yes"
                  : "border-border text-muted-foreground hover:border-muted-foreground/30",
              )}
            >
              YES <span className="font-normal opacity-70">{yesPct}%</span>
            </button>
            <button
              onClick={() => handleOutcomeToggle(1)}
              className={cn(
                "rounded-xl border-2 py-3 text-center font-bold transition-all",
                outcome === 1
                  ? "border-no bg-no/10 text-no"
                  : "border-border text-muted-foreground hover:border-muted-foreground/30",
              )}
            >
              NO <span className="font-normal opacity-70">{noPct}%</span>
            </button>
          </div>

          {/* Amount input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground/80">
              Position Size
            </label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setSelectedPreset(null);
                }}
                min="0"
                step="0.01"
                className="h-12 border-border bg-background text-lg font-black tabular-nums placeholder:text-muted-foreground/60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground/70">
                USDC
              </span>
            </div>
            <PresetAmounts
              amounts={[5, 10, 25, 50]}
              selected={selectedPreset}
              onSelect={handlePresetSelect}
            />
          </div>

          {/* Summary — real data from chain quote */}
          <div className="space-y-2.5 rounded-xl border border-border/50 bg-background/50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Cost</span>
              <span className="font-medium">
                ${sidebarQuote ? sidebarQuote.costUsdc.toFixed(2) : parsedAmount > 0 ? "..." : "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Potential Return</span>
              <span className="font-bold text-yes">
                {sidebarQuote && sidebarQuote.returnUsdc > 0 ? (
                  <>
                    ${sidebarQuote.returnUsdc.toFixed(2)}{" "}
                    <span className="text-yes/70">(+{sidebarQuote.returnPct.toFixed(0)}%)</span>
                  </>
                ) : (
                  "$0.00"
                )}
              </span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleTrade}
            disabled={isBuying}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            {!connected ? (
              <>
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </>
            ) : isBuying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm Position"
            )}
          </button>

          <p className="text-center text-[10px] uppercase tracking-widest font-semibold text-muted-foreground/60">
            Resolved by Hyphe Protocol
          </p>

          {/* View full details link */}
          <Link
            href={`/markets/${selectedMarket.id}`}
            className="flex items-center justify-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary/80"
          >
            View full details
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </aside>
    );
  }

  // ── Personal Summary (no market selected) ────────────────────
  return (
    <aside className="hidden w-80 shrink-0 flex-col border-l border-border xl:flex">
      <div className="p-5">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
          {connected ? "Your Positions" : "Get Started"}
        </h3>

        {!connected ? (
          /* Wallet not connected CTA */
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="mb-1.5 text-base font-bold">
                Connect Your Wallet
              </h4>
              <p className="text-sm text-muted-foreground">
                Connect to trade and track your positions
              </p>
            </div>
            <button
              onClick={connect}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-transform active:scale-95"
            >
              Connect Wallet
            </button>
          </div>
        ) : !chainPositions || chainPositions.length === 0 ? (
          /* Connected but no positions */
          <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              No positions yet
            </p>
            <p className="text-xs text-muted-foreground/70">
              Click YES or NO on any market to start trading
            </p>
          </div>
        ) : (
          /* Positions list — from chain */
          <div className="flex flex-col gap-3">
            {chainPositions.map((pos) => {
              const posMarket = markets.find((m) => m.id === pos.marketId);
              const posOdds = oddsMap[pos.marketId];
              const sharesDisplay = (Number(pos.shares) / 1e18).toFixed(2);
              return (
                <Link
                  key={`${pos.marketId}-${pos.outcome}`}
                  href={`/markets/${pos.marketId}`}
                  className="rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50"
                >
                  {posMarket && (
                    <p className="mb-2 text-sm font-bold leading-snug line-clamp-2 text-foreground/90">
                      {posMarket.question}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={cn(
                        "font-bold",
                        pos.outcome === 0 ? "text-yes" : "text-no",
                      )}
                    >
                      {pos.outcome === 0 ? "YES" : "NO"}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {sharesDisplay} shares &bull; ${pos.valueUsdc.toFixed(2)}
                    </span>
                  </div>
                  {posOdds && (
                    <div className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full">
                      <div
                        className="bg-yes"
                        style={{ width: `${posOdds.yes * 100}%` }}
                      />
                      <div className="flex-1 bg-no" />
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

/* ════════════════════════════════════════════════════════════════
   HOME PAGE
   ════════════════════════════════════════════════════════════════ */
type SortTab = "trending" | "newest" | "ending";

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortTab, setSortTab] = useState<SortTab>("trending");

  // Sync search from URL query param (from Navbar search)
  useEffect(() => {
    const q = searchParams.get("q");
    setSearch(q ?? "");
  }, [searchParams]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: markets, isLoading } = useMarkets("Open");
  const { data: vaultInfo } = useVaultInfo();
  const { data: platformStats } = useStats();
  const oddsMap = useMarketsStore((s) => s.oddsMap);
  const selectMarket = useTradeSidebarStore((s) => s.selectMarket);

  // Compute total volume from chain markets
  const totalVolume = useMemo(() => {
    if (!markets || markets.length === 0) return 0;
    return markets.reduce(
      (sum, m) => sum + Number(m.total_volume) / 10 ** USDC_DECIMALS,
      0,
    );
  }, [markets]);

  // Extract unique categories from chain markets
  const chainCategories = useMemo(() => {
    if (!markets) return [];
    const cats = new Set<string>();
    for (const m of markets) {
      if (m.category) cats.add(m.category);
    }
    return Array.from(cats).sort();
  }, [markets]);

  const featuredMarket = useMemo(() => {
    if (!markets || markets.length === 0) return null;
    return [...markets].sort(
      (a, b) => Number(b.total_volume) - Number(a.total_volume),
    )[0];
  }, [markets]);

  const countryMatches = useMemo(
    () => detectCountries(markets ?? []),
    [markets],
  );

  const filteredMarkets = useMemo(() => {
    if (!markets) return [];
    let result = markets;
    const hasActiveRefinement =
      category !== "all" || Boolean(search) || Boolean(selectedCountry);

    if (featuredMarket && !hasActiveRefinement) {
      result = result.filter((m) => m.id !== featuredMarket.id);
    }

    if (category !== "all") {
      result = result.filter(
        (m) => m.category.toLowerCase() === category.toLowerCase(),
      );
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.question.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q),
      );
    }

    if (selectedCountry) {
      const match = countryMatches.get(selectedCountry);
      if (match) {
        result = result.filter((m) => match.marketIds.has(m.id));
      }
    }

    switch (sortTab) {
      case "trending":
        result = [...result].sort(
          (a, b) => Number(b.total_volume) - Number(a.total_volume),
        );
        break;
      case "newest":
        result = [...result].sort((a, b) => b.created_at - a.created_at);
        break;
      case "ending":
        result = [...result].sort((a, b) => a.end_time - b.end_time);
        break;
    }

    return result;
  }, [markets, category, search, sortTab, featuredMarket, selectedCountry, countryMatches]);

  const visibleMarkets = filteredMarkets.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMarkets.length;

  function handleCategoryChange(cat: string) {
    setCategory(cat);
    setVisibleCount(12);
  }

  function handleFilterToggle(filterId: string) {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId],
    );
  }

  function handleSelectOutcome(marketId: number, outcome: 0 | 1) {
    selectMarket(marketId, outcome);
  }

  return (
    <div className="flex flex-col">
      {/* Stats Bar — full width */}
      <StatsBar vaultInfo={vaultInfo} marketsCount={markets?.length ?? 0} totalVolume={totalVolume} stats={platformStats} />

      {/* 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — desktop only (hidden on mobile via Sidebar's own className) */}
        <Sidebar
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
          activeFilters={activeFilters}
          onFilterToggle={handleFilterToggle}
          chainCategories={chainCategories}
        />

        {/* Main content */}
        <main className="min-w-0 flex-1 overflow-y-auto px-4 py-4 md:p-8">
          {/* Mobile Filters button */}
          <div className="mb-4 lg:hidden">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-background p-0">
                <SheetTitle className="sr-only">Filters</SheetTitle>
                <Sidebar
                  className="!flex !w-full border-none"
                  activeCategory={category}
                  onCategoryChange={(cat) => {
                    handleCategoryChange(cat);
                    setSidebarOpen(false);
                  }}
                  activeFilters={activeFilters}
                  onFilterToggle={handleFilterToggle}
                  chainCategories={chainCategories}
                />
              </SheetContent>
            </Sheet>
          </div>
          {/* Featured Market Hero */}
          {!isLoading && featuredMarket && (
            <section className="mb-10">
              <FeaturedMarketHero
                market={featuredMarket}
                odds={oddsMap[featuredMarket.id]}
              />
            </section>
          )}

          {isLoading && (
            <section className="mb-10">
              <div className="h-72 animate-pulse rounded-2xl border border-border bg-card/30" />
            </section>
          )}

          {/* Live Markets Header + Tabs */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <h3 className="text-xl font-bold md:text-2xl">Live Markets</h3>
              {selectedCountry && countryMatches.has(selectedCountry) && (
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
                >
                  {countryMatches.get(selectedCountry)!.countryName}
                  <X className="h-3 w-3" />
                </button>
              )}
              <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
                {(["trending", "newest", "ending"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setSortTab(tab);
                      setShowMap(false);
                    }}
                    className={cn(
                      "shrink-0 rounded-md px-3 py-1.5 text-sm font-bold transition-colors",
                      sortTab === tab && !showMap
                        ? "bg-primary text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {tab === "trending"
                      ? "Trending"
                      : tab === "newest"
                        ? "Newest"
                        : "Ending"}
                  </button>
                ))}
                <button
                  onClick={() => setShowMap(true)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-bold transition-colors",
                    showMap
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Globe className="h-3.5 w-3.5" />
                  Map
                </button>
              </div>
            </div>

            <Link
              href="/markets"
              className="inline-flex items-center gap-2 text-base font-bold text-primary transition-colors hover:text-primary/80"
            >
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {showMap ? (
            <WorldMap
              countryMatches={countryMatches}
              selectedCountry={selectedCountry}
              onSelectCountry={(code) => {
                setSelectedCountry(code);
                if (code) setShowMap(false);
              }}
            />
          ) : (
            <>
              {/* Market Grid */}
              <MarketGrid
                markets={visibleMarkets}
                oddsMap={oddsMap}
                loading={isLoading}
                onClearFilters={() => {
                  setCategory("all");
                  setSearch("");
                  setSelectedCountry(null);
                }}
                onSelectOutcome={handleSelectOutcome}
              />

              {/* Load More */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={() => setVisibleCount((c) => c + 12)}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-foreground/20 hover:text-foreground"
                  >
                    Load More
                    <ChevronDown className="h-3 w-3 transition-transform group-hover:translate-y-0.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Right Sidebar — Betslip / Personal Summary */}
        <HomeSidebar markets={markets ?? []} oddsMap={oddsMap} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
