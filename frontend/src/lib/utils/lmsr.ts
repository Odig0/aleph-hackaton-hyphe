import Decimal from "decimal.js";

Decimal.set({ precision: 30 });

/**
 * LMSR (Logarithmic Market Scoring Rule) calculations for client-side price previews.
 * These mirror the on-chain LMSR AMM contract logic.
 *
 * Cost function: C(q) = b * ln(sum(e^(q_i / b)))
 * Price of outcome i: p_i = e^(q_i / b) / sum(e^(q_j / b))
 */

/**
 * Calculate the price of an outcome given current quantities.
 * Returns a number between 0 and 1.
 */
export function lmsrPrice(
  quantities: bigint[],
  outcomeIndex: number,
  liquidityParam: bigint,
): number {
  const b = new Decimal(liquidityParam.toString());
  const qI = new Decimal(quantities[outcomeIndex].toString());

  let sumExp = new Decimal(0);
  for (const q of quantities) {
    const qD = new Decimal(q.toString());
    sumExp = sumExp.add(qD.div(b).exp());
  }

  const price = qI.div(b).exp().div(sumExp);
  return price.toNumber();
}

/**
 * Calculate the cost to buy `shares` of an outcome.
 * Returns the cost in raw USDC units (7 decimals).
 */
export function lmsrCost(
  quantities: bigint[],
  outcomeIndex: number,
  shares: bigint,
  liquidityParam: bigint,
): bigint {
  const b = new Decimal(liquidityParam.toString());

  // Cost before
  let sumExpBefore = new Decimal(0);
  for (const q of quantities) {
    sumExpBefore = sumExpBefore.add(new Decimal(q.toString()).div(b).exp());
  }
  const costBefore = b.mul(sumExpBefore.ln());

  // Cost after adding shares to the outcome
  let sumExpAfter = new Decimal(0);
  for (let i = 0; i < quantities.length; i++) {
    const q = new Decimal(quantities[i].toString());
    const adj = i === outcomeIndex ? q.add(new Decimal(shares.toString())) : q;
    sumExpAfter = sumExpAfter.add(adj.div(b).exp());
  }
  const costAfter = b.mul(sumExpAfter.ln());

  const diff = costAfter.sub(costBefore);
  return BigInt(diff.toFixed(0));
}

/**
 * Calculate all outcome prices given current quantities.
 */
export function lmsrPrices(
  quantities: bigint[],
  liquidityParam: bigint,
): number[] {
  return quantities.map((_, i) => lmsrPrice(quantities, i, liquidityParam));
}
