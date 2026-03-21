"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { truncateAddress, formatUsdc, formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils";
import type { TradeEvent } from "@/lib/stellar/types";

interface TradeHistoryProps {
  trades: TradeEvent[];
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  if (trades.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-muted-foreground">User</TableHead>
            <TableHead className="whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-muted-foreground">Side</TableHead>
            <TableHead className="whitespace-nowrap text-sm font-semibold uppercase tracking-wider text-muted-foreground">Outcome</TableHead>
            <TableHead className="whitespace-nowrap text-right text-sm font-semibold uppercase tracking-wider text-muted-foreground">Amount</TableHead>
            <TableHead className="whitespace-nowrap text-right text-sm font-semibold uppercase tracking-wider text-muted-foreground">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade, i) => (
            <TableRow key={`${trade.txHash}-${i}`} className="border-border/20">
              <TableCell>
                <span className="font-mono text-sm text-muted-foreground">
                  {truncateAddress(trade.user)}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    trade.side === "buy" ? "text-yes" : "text-no",
                  )}
                >
                  {trade.side.toUpperCase()}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-sm font-medium",
                    trade.outcome === 0 ? "text-yes" : "text-no",
                  )}
                >
                  <span className={cn(
                    "inline-block h-1.5 w-1.5 rounded-full",
                    trade.outcome === 0 ? "bg-yes" : "bg-no",
                  )} />
                  {trade.outcome === 0 ? "YES" : "NO"}
                </span>
              </TableCell>
              <TableCell className="text-right font-mono text-sm font-medium">
                {formatUsdc(trade.cost)}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDateTime(trade.timestamp)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
