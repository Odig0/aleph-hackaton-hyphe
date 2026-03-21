export const server = null;

export async function buildContractTx(
  contractId: string,
  method: string,
  _args: unknown[],
  signerAddress: string,
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return `mock-xdr-${contractId}-${method}-${signerAddress}`;
}

export async function readContract(
  _contractId: string,
  _method: string,
  _args: unknown[] = [],
): Promise<unknown> {
  await new Promise((resolve) => setTimeout(resolve, 90));
  return null;
}

export interface SubmitTxResult {
  hash: string;
  txResponse: {
    returnValue?: unknown;
  };
}

export async function submitTx(_signedXdr: string): Promise<SubmitTxResult> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    hash: `mock-submit-${Math.random().toString(16).slice(2, 14)}`,
    txResponse: {},
  };
}
