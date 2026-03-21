"use client";

import { useState } from "react";
import { Wallet, Copy, LogOut, ChevronDown, Droplets, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/hooks/useWallet";
import { useUsdcBalance } from "@/hooks/useUsdcBalance";
import { useFaucet } from "@/hooks/useFaucet";
import { truncateAddress, formatUsdc } from "@/lib/utils/format";
import { toast } from "sonner";

export function WalletButton() {
  const { connected, address, connecting, connect, getWalletOptions, disconnect } = useWallet();
  const { data: balance } = useUsdcBalance();
  const { requestFaucet, isPending: faucetPending } = useFaucet();
  const walletOptions = getWalletOptions();
  const [openWalletModal, setOpenWalletModal] = useState(false);

  const showFaucet = connected && address && (balance === undefined || balance === "0");

  const handleFaucet = async () => {
    if (!address) return;
    toast.info("Requesting 50 USDC...");
    try {
      await requestFaucet(address);
      toast.success("50 USDC sent to your wallet!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Faucet request failed";
      toast.error(message);
    }
  };

  if (!connected || !address) {
    return (
      <Dialog open={openWalletModal} onOpenChange={setOpenWalletModal}>
        <DialogTrigger asChild>
          <Button
            disabled={connecting}
            size="sm"
            className="btn-depth gap-2"
          >
            <Wallet className="h-3.5 w-3.5" />
            {connecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Wallet</DialogTitle>
            <DialogDescription>
              Select a wallet to connect in your browser.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            {walletOptions.map((option) => (
              <Button
                key={option.id}
                onClick={async () => {
                  await connect(option.id);
                  setOpenWalletModal(false);
                }}
                disabled={connecting}
                variant="outline"
                className="justify-start gap-2"
              >
                <Wallet className="h-4 w-4" />
                <span>{option.label}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10"
        >
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <span className="font-mono text-sm">
            {truncateAddress(address)}
          </span>
          {balance !== undefined && (
            <span className="border-l border-border pl-2 text-sm font-semibold text-foreground">
              {formatUsdc(BigInt(balance))} <span className="text-muted-foreground">USDC</span>
            </span>
          )}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {showFaucet && (
          <DropdownMenuItem
            onClick={handleFaucet}
            disabled={faucetPending}
            className="gap-2 text-sm"
          >
            {faucetPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Droplets className="h-3.5 w-3.5" />
            )}
            {faucetPending ? "Sending..." : "Get 50 USDC"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            navigator.clipboard.writeText(address);
            toast.success("Address copied");
          }}
          className="gap-2 text-sm"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={disconnect}
          className="gap-2 text-sm text-destructive focus:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
