"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { PresetAmounts } from "@/components/shared/PresetAmounts";
import { cn } from "@/lib/utils";
import { useWallet } from "@/hooks/useWallet";
import { useTrade } from "@/hooks/useTrade";
import { usePositions } from "@/hooks/usePositions";
import { useChainQuote } from "@/hooks/useChainQuote";
import { useChainSellQuote } from "@/hooks/useChainSellQuote";
import { txPending, txSuccess, txError } from "@/components/shared/TxToast";
import Decimal from "decimal.js";
import { toast } from "sonner";
import { Wallet, ArrowRight, Loader2 } from "lucide-react";
import type { MarketOdds } from "@/lib/stellar/types";

interface TradingPanelProps {
  marketId: number;
  odds: MarketOdds;
  className?: string;
}

export function TradingPanel({
  marketId,
  odds,
  className,
}: TradingPanelProps) {
  const { connected, connect } = useWallet();
  const { buy, sell, isBuying, isSelling } = useTrade();
  const { data: positions } = usePositions();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [outcome, setOutcome] = useState<0 | 1>(0);
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);

  const isLoading = isBuying || isSelling;
  const parsedAmount = parseFloat(amount) || 0;
  const currentOdds = outcome === 0 ? odds.yes : odds.no;

  // User's balance for current outcome (in shares, 18 decimal)
  const userPosition = useMemo(() => {
    if (!positions) return null;
    return positions.find(
      (p) => p.marketId === marketId && p.outcome === outcome,
    ) ?? null;
  }, [positions, marketId, outcome]);

  const userSharesFloat = userPosition
    ? Number(userPosition.shares) / 1e18
    : 0;

  // BUY: Convert USDC amount → shares in 18-decimal fixed-point
  const buyShares = useMemo(() => {
    if (side !== "buy" || parsedAmount <= 0 || currentOdds <= 0) return 0n;
    return BigInt(
      new Decimal(amount).div(Math.max(currentOdds, 0.01)).mul("1000000000000000000").toFixed(0),
    );
  }, [side, amount, parsedAmount, currentOdds]);

  // SELL: Convert shares input → 18-decimal bigint
  const sellShares = useMemo(() => {
    if (side !== "sell" || parsedAmount <= 0) return 0n;
    return BigInt(
      new Decimal(amount).mul("1000000000000000000").toFixed(0),
    );
  }, [side, amount, parsedAmount]);

  const activeShares = side === "buy" ? buyShares : sellShares;

  // Get real quote from AMM contract
  const { data: buyQuote } = useChainQuote(
    marketId, outcome, buyShares,
    side === "buy" && parsedAmount > 0,
  );
  const { data: sellQuote } = useChainSellQuote(
    marketId, outcome, sellShares,
    side === "sell" && parsedAmount > 0,
  );

  function handlePresetSelect(preset: number) {
    setSelectedPreset(preset);
    setAmount(preset.toString());
  }

  function handleSideChange(newSide: "buy" | "sell") {
    setSide(newSide);
    setAmount("");
    setSelectedPreset(null);
  }

  function handleSellMax() {
    if (userSharesFloat > 0) {
      // Use a slightly rounded value to avoid precision overflow
      setAmount(userSharesFloat.toFixed(4));
      setSelectedPreset(null);
    }
  }

  async function handleTrade() {
    if (!connected) {
      connect();
      return;
    }
    if (!amount || parsedAmount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (side === "sell" && sellShares > (userPosition?.shares ?? 0n)) {
      toast.error("Insufficient shares");
      return;
    }
    const toastId = txPending(
      `${side === "buy" ? "Buying" : "Selling"} ${outcome === 0 ? "YES" : "NO"}...`,
    );
    try {
      const fn = side === "buy" ? buy : sell;
      const result = await fn({ marketId, outcome, shares: activeShares });
      toast.dismiss(toastId);
      txSuccess(
        result.hash,
        `${side === "buy" ? "Bought" : "Sold"} ${outcome === 0 ? "YES" : "NO"} tokens`,
      );
      setAmount("");
      setSelectedPreset(null);
    } catch (err) {
      toast.dismiss(toastId);
      txError(err instanceof Error ? err.message : "Transaction failed");
    }
  }

  const panelContent = (
    <div className="space-y-6 p-4 md:space-y-8 md:p-6">
      {/* Buy / Sell toggle */}
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-background/50 p-1">
        <button
          onClick={() => handleSideChange("buy")}
          className={cn(
            "rounded-md py-2.5 text-sm font-bold transition-colors md:py-2",
            side === "buy"
              ? "bg-yes text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Buy
        </button>
        <button
          onClick={() => handleSideChange("sell")}
          className={cn(
            "rounded-md py-2.5 text-sm font-bold transition-colors md:py-2",
            side === "sell"
              ? "bg-no text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Sell
        </button>
      </div>

      {/* Outcome toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setOutcome(0)}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all",
            outcome === 0
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground/30 bg-background/50",
          )}
        >
          <span
            className={cn(
              "mb-1 text-sm font-bold uppercase tracking-widest",
              outcome === 0 ? "text-primary" : "text-muted-foreground",
            )}
          >
            {side === "buy" ? "Predict" : "Sell"}
          </span>
          <span className="text-xl font-black">YES</span>
        </button>

        <button
          onClick={() => setOutcome(1)}
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all",
            outcome === 1
              ? "border-primary bg-primary/10"
              : "border-border hover:border-muted-foreground/30 bg-background/50",
          )}
        >
          <span
            className={cn(
              "mb-1 text-sm font-bold uppercase tracking-widest",
              outcome === 1 ? "text-primary" : "text-muted-foreground",
            )}
          >
            {side === "buy" ? "Predict" : "Sell"}
          </span>
          <span className="text-xl font-black">NO</span>
        </button>
      </div>

      {/* Amount input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-base font-semibold text-foreground/80">
            {side === "buy" ? "Position Size" : "Shares to Sell"}
          </label>
          {side === "sell" && userSharesFloat > 0 && (
            <button
              onClick={handleSellMax}
              className="text-xs font-bold text-primary hover:text-primary/80"
            >
              Max: {userSharesFloat.toFixed(2)}
            </button>
          )}
        </div>
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
            className="h-14 border-border bg-background text-xl font-black tabular-nums placeholder:text-muted-foreground/60"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground/70">
            {side === "buy" ? "USDC" : "Shares"}
          </span>
        </div>
        {side === "buy" && (
          <PresetAmounts
            amounts={[5, 10, 25, 50]}
            selected={selectedPreset}
            onSelect={handlePresetSelect}
          />
        )}
      </div>

      {/* Summary stats */}
      <div className="space-y-3 rounded-xl border border-border/50 bg-background/50 p-5">
        {side === "buy" ? (
          <>
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Estimated Cost</span>
              <span className="font-medium">
                ${buyQuote ? buyQuote.costUsdc.toFixed(2) : parsedAmount > 0 ? "..." : "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">Potential Return</span>
              <span className="font-bold text-yes">
                {buyQuote && buyQuote.returnUsdc > 0 ? (
                  <>
                    ${buyQuote.returnUsdc.toFixed(2)}{" "}
                    <span className="text-yes/70">(+{buyQuote.returnPct.toFixed(0)}%)</span>
                  </>
                ) : (
                  "$0.00"
                )}
              </span>
            </div>
            {buyQuote && buyQuote.slippagePct > 0 && (
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Slippage</span>
                <span className="font-medium">{buyQuote.slippagePct.toFixed(2)}%</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between text-base">
              <span className="text-muted-foreground">You Receive</span>
              <span className="font-bold text-yes">
                ${sellQuote ? sellQuote.refundUsdc.toFixed(2) : parsedAmount > 0 ? "..." : "0.00"}
              </span>
            </div>
            {sellQuote && sellQuote.slippagePct > 0 && (
              <div className="flex justify-between text-base">
                <span className="text-muted-foreground">Slippage</span>
                <span className="font-medium">{sellQuote.slippagePct.toFixed(2)}%</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={handleTrade}
        disabled={isLoading}
        className={cn(
          "group flex w-full items-center justify-center gap-2 rounded-xl py-4 font-black text-white shadow-xl transition-all disabled:opacity-50",
          side === "buy"
            ? "bg-primary shadow-primary/30 hover:bg-primary/90"
            : "bg-no shadow-no/30 hover:bg-no/90",
        )}
      >
        {!connected ? (
          <>
            <Wallet className="h-4 w-4" />
            Connect Wallet
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Confirming...
          </>
        ) : (
          <>
            {side === "buy" ? "Confirm Buy" : "Confirm Sell"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p className="text-center text-xs uppercase tracking-widest font-semibold text-muted-foreground/70">
        Resolved by Hyphe Protocol &bull; Instant Liquidity
      </p>
    </div>
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-2xl md:sticky md:top-28",
        className,
      )}
    >
      <div className="flex items-center justify-between px-6 py-5">
        <h3 className="text-xl font-bold">Smart Trade</h3>
      </div>
      {panelContent}
    </div>
  );
}
