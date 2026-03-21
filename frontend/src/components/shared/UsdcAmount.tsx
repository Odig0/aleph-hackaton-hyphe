"use client";

import { formatUsdc } from "@/lib/utils/format";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UsdcAmountProps {
  raw: bigint;
  decimals?: number;
  prefix?: string;
  className?: string;
}

/**
 * Displays a formatted USDC amount with tooltip showing full precision.
 */
export function UsdcAmount({
  raw,
  decimals = 2,
  prefix = "",
  className,
}: UsdcAmountProps) {
  const display = formatUsdc(raw, decimals);
  const full = formatUsdc(raw, 7);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={className}>
            {prefix}
            {display} USDC
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {prefix}
            {full} USDC
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
