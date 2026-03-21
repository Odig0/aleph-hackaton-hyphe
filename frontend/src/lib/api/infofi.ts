import type { InfoFiSignal, PlayerValue } from "@/lib/stellar/types";
import {
  getMockMomentum,
  getMockPlayerValues,
  getMockSignals,
} from "@/lib/mocks/data";

export async function fetchSignals(limit = 50): Promise<InfoFiSignal[]> {
  return getMockSignals(limit);
}

export async function fetchPlayerValues(): Promise<PlayerValue[]> {
  return getMockPlayerValues();
}

export async function fetchMomentum(): Promise<
  { marketId: number; question: string; momentum: number }[]
> {
  return getMockMomentum();
}
