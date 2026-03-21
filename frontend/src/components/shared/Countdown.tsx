"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  endTime: number; // Unix timestamp in seconds
  className?: string;
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "Ended";

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function Countdown({ endTime, className }: CountdownProps) {
  const [remaining, setRemaining] = useState(() => {
    return Math.max(0, endTime - Math.floor(Date.now() / 1000));
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const r = Math.max(0, endTime - Math.floor(Date.now() / 1000));
      setRemaining(r);
      if (r <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return <span className={className}>{formatCountdown(remaining)}</span>;
}
