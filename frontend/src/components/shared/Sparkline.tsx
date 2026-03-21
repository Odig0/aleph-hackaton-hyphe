"use client";

import { useMemo } from "react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  color?: string;
}

export function Sparkline({
  data,
  width = 96,
  height = 40,
  className,
  color = "oklch(0.55 0.27 280)",
}: SparklineProps) {
  const { path, fillPath } = useMemo(() => {
    if (!data || data.length < 2) {
      // Flat line fallback
      const y = height / 2;
      return {
        path: `M 0 ${y} L ${width} ${y}`,
        fillPath: `M 0 ${y} L ${width} ${y} L ${width} ${height} L 0 ${height} Z`,
      };
    }

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = 2;

    const points = data.map((v, i) => ({
      x: (i / (data.length - 1)) * width,
      y: padding + ((max - v) / range) * (height - padding * 2),
    }));

    const lineParts = points.map((p, i) =>
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`,
    );

    const line = lineParts.join(" ");
    const fill =
      line +
      ` L ${width} ${height} L 0 ${height} Z`;

    return { path: line, fillPath: fill };
  }, [data, width, height]);

  const gradientId = useMemo(
    () => `sparkline-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradientId})`} />
      <path
        d={path}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
