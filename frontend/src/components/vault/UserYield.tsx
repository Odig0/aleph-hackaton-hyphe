"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UsdcAmount } from "@/components/shared/UsdcAmount";
import { Sparkles } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { VaultContract } from "@/lib/stellar/contracts";
import { txPending, txSuccess, txError } from "@/components/shared/TxToast";
import { toast } from "sonner";

interface UserYieldProps {
  pendingYield: string;
  deposit: string;
}

export function UserYield({ pendingYield, deposit }: UserYieldProps) {
  const yieldClaimable = BigInt(pendingYield);
  const depositAmount = BigInt(deposit);
  const { address } = useWallet();
  const [claiming, setClaiming] = useState(false);

  async function handleClaim() {
    if (!address) return;
    setClaiming(true);
    const toastId = txPending("Claiming yield...");

    try {
      const result = await VaultContract.claimYield(address);
      toast.dismiss(toastId);
      txSuccess(result.hash, "Yield claimed!");
    } catch (err) {
      toast.dismiss(toastId);
      txError(err instanceof Error ? err.message : "Claim failed");
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80">
      {/* Header */}
      <div className="border-b border-border/50 px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Your Position
        </p>
      </div>

      <div className="space-y-4 p-6">
        {/* Deposited */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Deposited</span>
          <UsdcAmount raw={depositAmount} className="text-base font-bold tracking-tight" />
        </div>

        {/* Pending yield — highlighted */}
        <div className="flex items-center justify-between rounded-xl bg-yes/5 px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yes" />
            <span className="text-sm font-medium text-yes/80">Pending Yield</span>
          </div>
          <UsdcAmount raw={yieldClaimable} className="text-lg font-bold tracking-tight text-yes" />
        </div>

        {/* Claim button */}
        {yieldClaimable > 0n && (
          <Button
            onClick={handleClaim}
            disabled={claiming}
            className="btn-depth w-full"
          >
            {claiming ? "Claiming..." : "Claim Yield"}
          </Button>
        )}
      </div>
    </div>
  );
}
