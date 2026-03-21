"use client";

import { useEffect, useRef } from "react";
import { createChart, LineSeries, type IChartApi } from "lightweight-charts";
import type { PriceHistoryPoint } from "@/lib/stellar/types";

interface OddsChartProps {
  data: PriceHistoryPoint[];
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySeriesApi = any;

export function OddsChart({ data, className }: OddsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const yesSeriesRef = useRef<AnySeriesApi>(null);
  const noSeriesRef = useRef<AnySeriesApi>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isDark = document.documentElement.classList.contains("dark");

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: isDark ? "#78788a" : "#83839a",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: isDark ? "rgba(45, 42, 60, 0.5)" : "#e8e8f0" },
        horzLines: { color: isDark ? "rgba(45, 42, 60, 0.5)" : "#e8e8f0" },
      },
      crosshair: {
        vertLine: { color: "rgba(139, 92, 246, 0.5)", width: 1, style: 2 },
        horzLine: { color: "rgba(139, 92, 246, 0.5)", width: 1, style: 2 },
      },
      timeScale: {
        borderColor: isDark ? "#2d2a3c" : "#dddde6",
      },
      rightPriceScale: {
        borderColor: isDark ? "#2d2a3c" : "#dddde6",
      },
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 300,
    });

    const yesSeries = chart.addSeries(LineSeries, {
      color: "#34d399",
      lineWidth: 2,
    });

    const noSeries = chart.addSeries(LineSeries, {
      color: "#fb7185",
      lineWidth: 2,
    });

    chartRef.current = chart;
    yesSeriesRef.current = yesSeries;
    noSeriesRef.current = noSeries;

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight || 300,
        });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // Update data when it changes
  useEffect(() => {
    if (!yesSeriesRef.current || !noSeriesRef.current || !data.length) return;

    // Ensure time is a Unix timestamp in seconds (lightweight-charts requirement)
    const toUnix = (t: number | string): number => {
      if (typeof t === "string") return Math.floor(new Date(t).getTime() / 1000);
      // If already in ms (> year 2100 in seconds), convert
      return t > 4_000_000_000 ? Math.floor(t / 1000) : t;
    };

    const yesData = data.map((d) => ({
      time: toUnix(d.time) as never,
      value: d.yes * 100,
    }));

    const noData = data.map((d) => ({
      time: toUnix(d.time) as never,
      value: d.no * 100,
    }));

    yesSeriesRef.current.setData(yesData);
    noSeriesRef.current.setData(noData);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  return (
    <div ref={containerRef} className={className} />
  );
}
