

import { Address, Client, parseAbi } from 'viem';

// Contract ABIs (simplified)
export const HYPHE_MARKET_ABI = parseAbi([
  'function create_market(string market_id, string title, string description, string resolution_url, string predicted_outcome)',
  'function buy_outcome(string market_id, string outcome, uint256 collateral_amount)',
  'function resolve_market(string market_id)',
  'function redeem_winning_shares(string market_id)',
  'function get_market(string market_id) returns (tuple(string id, string title, uint256 status, uint256 yes_probability, uint256 no_probability, uint256 total_volume))',
  'function get_market_odds(string market_id) returns (tuple(uint256 yes_probability, uint256 no_probability))',
  'function get_user_positions(address user) returns (tuple(string market_id, string outcome, uint256 collateral, uint256 shares)[])',
  'function get_user_yield(address user) returns (uint256)',
]);

export const HYPHE_ORACLE_ABI = parseAbi([
  'function submit_resolution(string market_id, string outcome, string source_urls, uint256 confidence)',
  'function dispute_resolution(string market_id, string challenge_outcome, string reasoning)',
  'function finalize_resolution(string market_id)',
  'function get_submission(string market_id) returns (tuple(string market_id, address oracle, string outcome, uint256 confidence, string timestamp, uint256 dispute_count, bool finalized))',
  'function get_market_resolution(string market_id) returns (string)',
  'function get_disputes(string market_id) returns (tuple(address challenger, string outcome, uint256 bond, bool resolved, address winner)[])',
]);

export const HYPHE_TOKEN_ABI = parseAbi([
  'function mint(address to, uint256 amount)',
  'function burn(address from_addr, uint256 amount)',
  'function transfer(address to, uint256 amount)',
  'function approve(address spender, uint256 amount)',
  'function balance_of(address account) returns (uint256)',
  'function total_supply() returns (uint256)',
  'function get_metadata() returns (tuple(string name, string symbol, uint256 decimals, uint256 total_supply))',
]);

// Contract type interfaces
export interface Market {
  id: string;
  title: string;
  description: string;
  status: number; // 0=ACTIVE, 1=RESOLVED, 2=DISPUTED, 3=FINALIZED
  resolved_outcome: string;
  yes_probability: number;
  no_probability: number;
  total_volume: bigint;
  yes_collateral: bigint;
  no_collateral: bigint;
}

export interface MarketOdds {
  yes_probability: number;
  no_probability: number;
  yes_shares: bigint;
  no_shares: bigint;
}

export interface UserPosition {
  market_id: string;
  outcome: string;
  collateral: bigint;
  shares: bigint;
}

export interface OracleSubmission {
  market_id: string;
  oracle: Address;
  outcome: string;
  confidence: number;
  timestamp: string;
  dispute_count: number;
  finalized: boolean;
  status: number;
}

export interface Dispute {
  challenger: Address;
  outcome: string;
  bond: bigint;
  resolved: boolean;
  winner: Address;
}

// Hook: Create Market
export async function useCreateMarket(
  marketAddress: Address,
  {
    marketId,
    title,
    description,
    resolutionUrl,
    predictedOutcome,
  }: {
    marketId: string;
    title: string;
    description: string;
    resolutionUrl: string;
    predictedOutcome: 'YES' | 'NO';
  }
) {
  try {
    // Call contract
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: marketAddress,
        method: 'create_market',
        args: [marketId, title, description, resolutionUrl, predictedOutcome],
      }),
    });

    return await result.json();
  } catch (error) {
    console.error('Failed to create market:', error);
    throw error;
  }
}

// Hook: Buy Outcome
export async function useBuyOutcome(
  marketAddress: Address,
  {
    marketId,
    outcome,
    collateralAmount,
  }: {
    marketId: string;
    outcome: 'YES' | 'NO';
    collateralAmount: bigint;
  }
) {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: marketAddress,
        method: 'buy_outcome',
        args: [marketId, outcome, collateralAmount.toString()],
      }),
    });

    return await result.json();
  } catch (error) {
    console.error('Failed to buy outcome:', error);
    throw error;
  }
}

// Hook: Get Market
export async function useGetMarket(
  marketAddress: Address,
  marketId: string
): Promise<Market> {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: marketAddress,
        method: 'get_market',
        args: [marketId],
      }),
    });

    return await result.json();
  } catch (error) {
    console.error('Failed to get market:', error);
    throw error;
  }
}

// Hook: Get Market Odds
export async function useGetMarketOdds(
  marketAddress: Address,
  marketId: string
): Promise<MarketOdds> {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: marketAddress,
        method: 'get_market_odds',
        args: [marketId],
      }),
    });

    return await result.json();
  } catch (error) {
    console.error('Failed to get market odds:', error);
    throw error;
  }
}

// Hook: Get User Positions
export async function useGetUserPositions(
  marketAddress: Address,
  userAddress: Address
): Promise<UserPosition[]> {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: marketAddress,
        method: 'get_user_positions',
        args: [userAddress],
      }),
    });

    const positions = await result.json();
    return Array.isArray(positions) ? positions : [];
  } catch (error) {
    console.error('Failed to get user positions:', error);
    throw error;
  }
}

// Hook: Get User Yield
export async function useGetUserYield(
  marketAddress: Address,
  userAddress: Address
): Promise<bigint> {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: marketAddress,
        method: 'get_user_yield',
        args: [userAddress],
      }),
    });

    const yieldAmount = await result.json();
    return BigInt(yieldAmount);
  } catch (error) {
    console.error('Failed to get user yield:', error);
    return BigInt(0);
  }
}

// Oracle Hooks
export async function useSubmitResolution(
  oracleAddress: Address,
  {
    marketId,
    outcome,
    sourceUrls,
    confidence,
  }: {
    marketId: string;
    outcome: 'YES' | 'NO';
    sourceUrls: string[];
    confidence: number;
  }
) {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: oracleAddress,
        method: 'submit_resolution',
        args: [
          marketId,
          outcome,
          JSON.stringify(sourceUrls),
          confidence.toString(),
        ],
      }),
    });

    return await result.json();
  } catch (error) {
    console.error('Failed to submit resolution:', error);
    throw error;
  }
}

export async function useDisputeResolution(
  oracleAddress: Address,
  {
    marketId,
    challengeOutcome,
    reasoning,
  }: {
    marketId: string;
    challengeOutcome: 'YES' | 'NO';
    reasoning: string;
  }
) {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: oracleAddress,
        method: 'dispute_resolution',
        args: [marketId, challengeOutcome, reasoning],
      }),
    });

    return await result.json();
  } catch (error) {
    console.error('Failed to dispute resolution:', error);
    throw error;
  }
}

export async function useGetSubmission(
  oracleAddress: Address,
  marketId: string
): Promise<OracleSubmission> {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: oracleAddress,
        method: 'get_submission',
        args: [marketId],
      }),
    });

    return await result.json();
  } catch (error) {
    console.error('Failed to get submission:', error);
    throw error;
  }
}

export async function useGetDisputes(
  oracleAddress: Address,
  marketId: string
): Promise<Dispute[]> {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: oracleAddress,
        method: 'get_disputes',
        args: [marketId],
      }),
    });

    const data = await result.json();
    return data.disputes || [];
  } catch (error) {
    console.error('Failed to get disputes:', error);
    return [];
  }
}

// Token Hooks
export async function useTokenBalanceOf(
  tokenAddress: Address,
  accountAddress: Address
): Promise<bigint> {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: tokenAddress,
        method: 'balance_of',
        args: [accountAddress],
      }),
    });

    const balance = await result.json();
    return BigInt(balance);
  } catch (error) {
    console.error('Failed to get token balance:', error);
    return BigInt(0);
  }
}

export async function useTransferToken(
  tokenAddress: Address,
  { to, amount }: { to: Address; amount: bigint }
) {
  try {
    const result = await fetch('/api/contract', {
      method: 'POST',
      body: JSON.stringify({
        contract: tokenAddress,
        method: 'transfer',
        args: [to, amount.toString()],
      }),
    });

    return await result.json();
  } catch (error) {
    console.error('Failed to transfer token:', error);
    throw error;
  }
}
