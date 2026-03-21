import { makeMockHash } from "@/lib/mocks/data";

export interface TxResult {
  hash: string;
  explorerUrl: string;
  returnValue?: unknown;
}

export async function executeContractCall(
  _contractId: string,
  method: string,
  _args: unknown[],
  _signerAddress: string,
): Promise<TxResult> {
  await new Promise((resolve) => setTimeout(resolve, 220));

  return {
    hash: makeMockHash(method),
    explorerUrl: "",
  };
}
