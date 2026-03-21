"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSignedPercent } from "@/lib/utils/format";

interface MomentumItem {
  marketId: number;
  question: string;
  momentum: number;
}

interface MomentumListProps {
  items: MomentumItem[];
}

export function MomentumList({ items }: MomentumListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card/80">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-border/50 px-6 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <TrendingUp className="h-3.5 w-3.5 text-primary" />
        </div>
        <h3 className="text-base font-semibold tracking-tight">Top Momentum</h3>
      </div>

      <div className="divide-y divide-border/30">
        {items.map((item, i) => (
          <Link
            key={item.marketId}
            href={`/markets/${item.marketId}`}
            className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-accent/50"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                {i + 1}
              </span>
              <span className="truncate text-sm font-medium">
                {item.question}
              </span>
            </div>
            <span
              className={cn(
                "ml-3 shrink-0 font-mono text-sm font-bold",
                item.momentum >= 0 ? "text-yes" : "text-no",
              )}
            >
              {item.momentum >= 0 ? "+" : ""}{formatSignedPercent(item.momentum / 100)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
