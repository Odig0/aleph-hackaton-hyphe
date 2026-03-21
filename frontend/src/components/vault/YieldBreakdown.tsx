"use client";

interface YieldBreakdownProps {
  liquidity: number; // percentage (e.g. 70)
  depositors: number; // percentage (e.g. 20)
  protocol: number; // percentage (e.g. 10)
}

export function YieldBreakdown({
  liquidity = 70,
  depositors = 20,
  protocol = 10,
}: YieldBreakdownProps) {
  const segments = [
    { label: "Market Liquidity", pct: liquidity, color: "bg-primary", textColor: "text-primary", glowColor: "oklch(0.72 0.20 275 / 0.15)" },
    { label: "Depositors", pct: depositors, color: "bg-yes", textColor: "text-yes", glowColor: "oklch(0.72 0.17 160 / 0.15)" },
    { label: "Protocol", pct: protocol, color: "bg-warning", textColor: "text-warning", glowColor: "oklch(0.80 0.18 85 / 0.15)" },
  ];

  return (
    <div className="space-y-5">
      {/* Horizontal stacked bar — taller, rounded */}
      <div className="flex h-3 overflow-hidden rounded-full bg-muted/30">
        {segments.map(({ label, pct, color }) => (
          <div
            key={label}
            className={`${color} transition-all duration-700 ease-out first:rounded-l-full last:rounded-r-full`}
            style={{ width: `${pct}%` }}
          />
        ))}
      </div>

      {/* Legend — each with value prominently displayed */}
      <div className="space-y-3">
        {segments.map(({ label, pct, color, textColor }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />
              <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <span className={`text-lg font-bold tracking-tight ${textColor}`}>
              {pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
