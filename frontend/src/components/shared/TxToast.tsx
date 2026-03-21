"use client";

import { toast } from "sonner";

export function txPending(message = "Submitting transaction...") {
  return toast.loading(message, {
    description: "Processing in mock mode...",
  });
}

export function txSuccess(hash: string, message = "Transaction confirmed!") {
  toast.success(message, {
    description: `Mock tx: ${hash.slice(0, 14)}...`,
    duration: 5000,
  });
}

export function txError(error: string, message = "Transaction failed") {
  toast.error(message, {
    description: error,
    duration: 8000,
  });
}
