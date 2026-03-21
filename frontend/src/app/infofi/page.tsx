"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { SignalsTable } from "@/components/infofi/SignalsTable";
import { MomentumList } from "@/components/infofi/MomentumList";
import { PlayerValueCard } from "@/components/infofi/PlayerValueCard";
import { fetchSignals, fetchMomentum, fetchPlayerValues } from "@/lib/api/infofi";
import { Zap, Activity, Radio } from "lucide-react";
import { Footer } from "@/components/layout/Footer";

export default function SignalsPage() {
  const { data: signals, isLoading: loadingSignals } = useQuery({
    queryKey: ["signals"],
    queryFn: () => fetchSignals(),
    refetchInterval: 15_000,
  });

  const { data: momentum, isLoading: loadingMomentum } = useQuery({
    queryKey: ["momentum"],
    queryFn: fetchMomentum,
    refetchInterval: 15_000,
  });

  const { data: players, isLoading: loadingPlayers } = useQuery({
    queryKey: ["player-values"],
    queryFn: fetchPlayerValues,
    refetchInterval: 30_000,
  });

  return (
    <>
    <div className="mx-auto max-w-[1600px] px-6 pb-8">
      {/* Page header */}
      <div className="py-16">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
              InfoFi Signals
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              The Pulse
            </h1>
          </div>
        </div>
        <p className="mt-2 max-w-lg text-base leading-relaxed text-muted-foreground">
          Real-time signal detection and sentiment shifts across all markets.
        </p>
      </div>

      {/* Top row: Momentum + Players */}
      <div className="grid grid-cols-2 gap-6">
        {loadingMomentum ? (
          <Skeleton className="h-64 rounded-2xl" />
        ) : momentum && momentum.length > 0 ? (
          <MomentumList items={momentum} />
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
            <div>
              <Activity className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
              <p className="text-base text-muted-foreground">No momentum data yet</p>
            </div>
          </div>
        )}

        {loadingPlayers ? (
          <Skeleton className="h-64 rounded-2xl" />
        ) : players && players.length > 0 ? (
          <PlayerValueCard players={players} />
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-border/50 bg-card/50 p-12 text-center">
            <div>
              <Activity className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
              <p className="text-base text-muted-foreground">No player data yet</p>
            </div>
          </div>
        )}
      </div>

      {/* Signals Table */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-border/50 bg-card/80">
        <div className="flex items-center gap-2 border-b border-border/50 px-6 py-4">
          <Radio className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold tracking-tight">Recent Signals</h3>
        </div>
        <div className="p-4">
          {loadingSignals ? (
            <div className="space-y-3 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : signals && signals.length > 0 ? (
            <SignalsTable signals={signals} />
          ) : (
            <div className="py-12 text-center">
              <Radio className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
              <p className="text-base text-muted-foreground">
                No signals yet. Check back as markets generate activity.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}
