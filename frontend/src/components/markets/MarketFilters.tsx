"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MarketFiltersProps {
  status: string;
  onStatusChange: (status: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
}

const statuses = [
  { value: "all", label: "All Markets" },
  { value: "Open", label: "Live" },
  { value: "Closed", label: "Closed" },
  { value: "Resolved", label: "Resolved" },
];

export function MarketFilters({
  status,
  onStatusChange,
  search,
  onSearchChange,
}: MarketFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Status filters as pills */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onStatusChange(value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200",
              status === value
                ? "bg-primary/15 text-primary shadow-[0_0_12px_oklch(0.72_0.20_275/0.12)]"
                : "bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-xs flex-1 sm:max-w-[280px]">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/70" />
        <Input
          placeholder="Search markets..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 border-border/50 bg-card/50 pl-9 text-sm placeholder:text-muted-foreground/70"
        />
      </div>
    </div>
  );
}
