import type { VaultInfo, UserVaultInfo } from "@/lib/stellar/types";
import { getMockUserVaultInfo, getMockVaultInfo } from "@/lib/mocks/data";

export async function fetchVaultInfo(): Promise<VaultInfo> {
  return getMockVaultInfo();
}

export async function fetchUserVaultInfo(
  address: string,
): Promise<UserVaultInfo> {
  return getMockUserVaultInfo(address);
}
