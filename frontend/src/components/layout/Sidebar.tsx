"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  Compass,
  Clock,
  Droplets,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

const filters = [
  { id: "ending-soon", label: "Ending Soon", icon: Clock },
  { id: "high-liquidity", label: "High Liquidity", icon: Droplets },
  { id: "verified-only", label: "Verified Only", icon: ShieldCheck },
];

interface SidebarProps {
  className?: string;
  activeCategory?: string;
  onCategoryChange?: (cat: string) => void;
  activeFilters?: string[];
  onFilterToggle?: (filterId: string) => void;
  /** Categories derived from on-chain market data */
  chainCategories?: string[];
}

export function Sidebar({
  className,
  activeCategory = "all",
  onCategoryChange,
  activeFilters = [],
  onFilterToggle,
  chainCategories = [],
}: SidebarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/markets";

  // Build category list dynamically from on-chain data
  const categories = useMemo(() => {
    const items: { value: string; label: string }[] = [
      { value: "all", label: "All Markets" },
    ];
    for (const cat of chainCategories) {
      if (cat) items.push({ value: cat, label: cat });
    }
    return items;
  }, [chainCategories]);

  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 border-r border-border/50 bg-sidebar lg:flex lg:flex-col",
        className,
      )}
    >
      <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6 scrollbar-none">
        {/* Explore Section */}
        <div>
          <h4 className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Explore
          </h4>
          <nav className="space-y-0.5">
            {categories.map(({ value, label }) => {
              const active = isHome && activeCategory === value;
              const Icon = value === "all" ? Compass : Tag;

              return (
                <button
                  key={value}
                  onClick={() => onCategoryChange?.(value)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                  )}
                >
                  <Icon className={cn("h-4 w-4", active && "text-primary")} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Filter By Section */}
        <div>
          <h4 className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Filter By
          </h4>
          <div className="space-y-1 px-1">
            {filters.map(({ id, label, icon: Icon }) => {
              const active = activeFilters.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => onFilterToggle?.(id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-muted-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                      active
                        ? "border-primary bg-primary"
                        : "border-border/60 bg-transparent",
                    )}
                  >
                    {active && (
                      <svg
                        className="h-3 w-3 text-primary-foreground"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M10 3L4.5 8.5L2 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />
      </div>
    </aside>
  );
}
