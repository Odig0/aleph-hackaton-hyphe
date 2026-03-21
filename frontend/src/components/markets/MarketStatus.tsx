import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MarketStatus as Status } from "@/lib/stellar/types";

interface MarketStatusProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  Open: {
    label: "Live",
    className: "border-yes/20 bg-yes/10 text-yes",
  },
  Closed: {
    label: "Closed",
    className: "border-warning/20 bg-warning/10 text-warning",
  },
  Resolved: {
    label: "Resolved",
    className: "border-muted-foreground/20 bg-muted text-muted-foreground",
  },
  Disputed: {
    label: "Disputed",
    className: "border-no/20 bg-no/10 text-no",
  },
};

export function MarketStatusBadge({ status }: MarketStatusProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
        config.className,
      )}
    >
      {status === "Open" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yes opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-yes" />
        </span>
      )}
      {config.label}
    </Badge>
  );
}
