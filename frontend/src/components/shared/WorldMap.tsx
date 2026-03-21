"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CountryMatch } from "@/lib/utils/countryMarkets";

const GEO_URL = "/data/world-110m.json";

interface WorldMapProps {
  countryMatches: Map<string, CountryMatch>;
  selectedCountry: string | null;
  onSelectCountry: (code: string | null) => void;
  className?: string;
}

interface TooltipState {
  name: string;
  count: number;
  x: number;
  y: number;
}

export function WorldMap({
  countryMatches,
  selectedCountry,
  onSelectCountry,
  className,
}: WorldMapProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const entries = useMemo(
    () => Array.from(countryMatches.values()),
    [countryMatches],
  );

  const maxCount = useMemo(
    () => Math.max(1, ...entries.map((e) => e.marketCount)),
    [entries],
  );

  const handleMarkerEnter = useCallback(
    (entry: CountryMatch, e: React.MouseEvent) => {
      setTooltip({
        name: entry.countryName,
        count: entry.marketCount,
        x: e.clientX,
        y: e.clientY,
      });
    },
    [],
  );

  const handleMarkerMove = useCallback(
    (e: React.MouseEvent) => {
      if (tooltip) {
        setTooltip((prev) =>
          prev ? { ...prev, x: e.clientX, y: e.clientY } : null,
        );
      }
    },
    [tooltip],
  );

  const handleMarkerLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleMarkerClick = useCallback(
    (code: string) => {
      onSelectCountry(selectedCountry === code ? null : code);
    },
    [selectedCountry, onSelectCountry],
  );

  if (entries.length === 0) return null;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-card", className)}>
        {/* SVG glow filter (hidden) */}
        <svg width={0} height={0} className="absolute">
          <defs>
            <filter id="map-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        <ComposableMap
          projection="geoNaturalEarth1"
          projectionConfig={{ scale: 147 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto", display: "block" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="oklch(0.12 0.015 275)"
                  stroke="oklch(0.18 0.018 275)"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {entries.map((entry, i) => {
            const isSelected = selectedCountry === entry.countryCode;
            const sizeNorm = entry.marketCount / maxCount;
            const r = 3 + sizeNorm * 5; // 3–8px radius

            return (
              <Marker
                key={entry.countryCode}
                coordinates={entry.coordinates}
                onMouseEnter={(e) =>
                  handleMarkerEnter(
                    entry,
                    e as unknown as React.MouseEvent,
                  )
                }
                onMouseMove={(e) =>
                  handleMarkerMove(e as unknown as React.MouseEvent)
                }
                onMouseLeave={handleMarkerLeave}
                onClick={() => handleMarkerClick(entry.countryCode)}
                style={{
                  default: { cursor: "pointer" },
                  hover: { cursor: "pointer" },
                  pressed: { cursor: "pointer" },
                }}
              >
                {/* Pulse ring */}
                <circle
                  r={r + 4}
                  fill="none"
                  stroke={
                    isSelected
                      ? "oklch(0.66 0.19 160)"
                      : "oklch(0.55 0.27 280)"
                  }
                  strokeWidth={1}
                  opacity={0}
                  className="animate-map-dot-pulse"
                  style={{ animationDelay: `${(i * 0.3) % 3}s` }}
                />
                {/* Main dot */}
                <circle
                  r={r}
                  fill={
                    isSelected
                      ? "oklch(0.66 0.19 160)"
                      : "oklch(0.55 0.27 280)"
                  }
                  filter="url(#map-glow)"
                  opacity={isSelected ? 1 : 0.85}
                />
                {/* Inner highlight */}
                <circle
                  r={r * 0.4}
                  fill="oklch(1 0 0 / 0.3)"
                />
              </Marker>
            );
          })}
        </ComposableMap>

        {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg border border-border bg-popover px-3 py-1.5 shadow-lg"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 8,
          }}
        >
          <p className="text-sm font-bold text-foreground">
            {tooltip.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {tooltip.count} {tooltip.count === 1 ? "market" : "markets"}
          </p>
        </div>
      )}
    </div>
  );
}
