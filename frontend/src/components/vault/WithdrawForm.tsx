"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PresetAmounts } from "@/components/shared/PresetAmounts";
import { ArrowRight, Wallet, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { VaultContract } from "@/lib/stellar/contracts";
import { parseUsdc } from "@/lib/utils/format";
import { txPending, txSuccess, txError } from "@/components/shared/TxToast";
import { toast } from "sonner";

export function WithdrawForm() {
  const { connected, address, connect } = useWallet();
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  function handlePresetSelect(preset: number) {
    setSelectedPreset(preset);
    setAmount(preset.toString());
  }

  async function handleWithdraw() {
    if (!connected || !address) {
      connect();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    setLoading(true);
    const toastId = txPending("Withdrawing USDC...");

    try {
      const raw = parseUsdc(amount);
      const result = await VaultContract.withdraw(address, raw);
      toast.dismiss(toastId);
      txSuccess(result.hash, "USDC withdrawn successfully");
      setAmount("");
      setSelectedPreset(null);
    } catch (err) {
      toast.dismiss(toastId);
      txError(err instanceof Error ? err.message : "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Amount to withdraw
          </label>
          <span className="text-sm text-muted-foreground">USDC</span>
        </div>
        <PresetAmounts
          amounts={[10, 50, 100, 500]}
          selected={selectedPreset}
          onSelect={handlePresetSelect}
        />
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
          className="h-12 border-border/50 bg-background/50 text-lg font-medium tabular-nums placeholder:text-muted-foreground"
        />
      </div>
      <Button
        onClick={handleWithdraw}
        disabled={loading}
        variant="outline"
        className="group w-full"
        size="lg"
      >
        {!connected ? (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        ) : loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Withdrawing...
          </>
        ) : (
          <>
            Withdraw USDC
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </Button>
    </div>
  );
}
