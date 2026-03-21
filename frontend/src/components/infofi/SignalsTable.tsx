"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { formatSignedPercent, formatDateTime } from "@/lib/utils/format";
import type { InfoFiSignal } from "@/lib/stellar/types";

interface SignalsTableProps {
  signals: InfoFiSignal[];
}

const confidenceStyles = {
  high: "border-primary/20 bg-primary/10 text-primary",
  medium: "border-warning/20 bg-warning/10 text-warning",
  low: "border-muted-foreground/20 bg-muted text-muted-foreground",
};

const typeLabels: Record<string, string> = {
  odds_shift: "Odds Shift",
  momentum: "Momentum",
  volume_spike: "Volume Spike",
  whale_alert: "Whale Alert",
};

const typeIcons: Record<string, string> = {
  odds_shift: "~",
  momentum: "/",
  volume_spike: "!",
  whale_alert: "@",
};

export function SignalsTable({ signals }: SignalsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Market</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Signal</TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Value</TableHead>
            <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Confidence</TableHead>
            <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {signals.map((signal, i) => (
            <TableRow key={`${signal.marketId}-${signal.type}-${i}`} className="border-border/20">
              <TableCell>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 font-mono text-xs text-primary">
                    {typeIcons[signal.type] || "?"}
                  </span>
                  {typeLabels[signal.type] || signal.type}
                </span>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                {signal.marketQuestion}
              </TableCell>
              <TableCell className="max-w-[250px] text-sm text-muted-foreground">
                {signal.description}
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={cn(
                    "font-mono text-sm font-bold",
                    signal.value >= 0 ? "text-yes" : "text-no",
                  )}
                >
                  {signal.value >= 0 ? "+" : ""}{formatSignedPercent(signal.value / 100)}
                </span>
              </TableCell>
              <TableCell>
                <span className={cn(
                  "inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider",
                  confidenceStyles[signal.confidence],
                )}>
                  {signal.confidence}
                </span>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDateTime(signal.timestamp)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
