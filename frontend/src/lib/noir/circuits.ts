/**
 * Circuit loading utilities.
 * Compiled Noir circuits are stored as JSON in /public/circuits/
 */

let privateBetCircuit: unknown = null;
let privateRedemptionCircuit: unknown = null;

export async function loadPrivateBetCircuit(): Promise<unknown> {
  if (privateBetCircuit) return privateBetCircuit;
  privateBetCircuit = await fetch("/circuits/private_bet.json").then((r) =>
    r.json(),
  );
  return privateBetCircuit;
}

export async function loadPrivateRedemptionCircuit(): Promise<unknown> {
  if (privateRedemptionCircuit) return privateRedemptionCircuit;
  privateRedemptionCircuit = await fetch(
    "/circuits/private_redemption.json",
  ).then((r) => r.json());
  return privateRedemptionCircuit;
}
