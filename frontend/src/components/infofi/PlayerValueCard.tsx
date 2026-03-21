"use client";

import { cn } from "@/lib/utils";
import { formatSignedPercent } from "@/lib/utils/format";
import { Users } from "lucide-react";
import type { PlayerValue } from "@/lib/stellar/types";

interface PlayerValueCardProps {
  players: PlayerValue[];
}

const confidenceStyles = {
  high: "border-primary/20 bg-primary/10 text-primary",
  medium: "border-warning/20 bg-warning/10 text-warning",
  low: "border-muted-foreground/20 bg-muted text-muted-foreground",
};

export function PlayerValueCard({ players }: PlayerValueCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Users className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">Player Values</h3>
      </div>

      <div className="divide-y divide-border/30">
        {players.map((player) => (
          <div
            key={player.name}
            className="flex items-center justify-between px-6 py-3.5"
          >
            <span className="text-sm font-medium">{player.name}</span>
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "font-mono text-sm font-bold",
                  player.change24h >= 0 ? "text-yes" : "text-no",
                )}
              >
                {player.change24h >= 0 ? "+" : ""}{formatSignedPercent(player.change24h / 100)}
              </span>
              <span className={cn(
                "inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider",
                confidenceStyles[player.confidence],
              )}>
                {player.confidence}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
