import type { ChainMarketInfo } from "./types";
import type { TxResult } from "./transaction";
import {
  getMockMarket,
  getMockMarkets,
  makeMockHash,
  toChainMarketInfo,
  toPriceBigints,
} from "@/lib/mocks/data";

const E7 = 10n ** 7n;
const E18 = 10n ** 18n;

function delay(ms = 120) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeTx(action: string): TxResult {
  return {
    hash: makeMockHash(action),
    explorerUrl: "",
  };
}

export const MarketContract = {
  async marketCount() {
    await delay();
    return BigInt(getMockMarkets().length);
  },

  async getMarket(_marketId: number) {
    await delay();
    return null;
  },

  async getMarketParsed(marketId: number): Promise<ChainMarketInfo> {
    await delay();
    return toChainMarketInfo(getMockMarket(marketId));
  },

  async marketCountParsed(): Promise<number> {
    await delay();
    return getMockMarkets().length;
  },

  async split(
    _userAddress: string,
    _marketId: number,
    _amount: bigint,
  ): Promise<TxResult> {
    await delay();
    return makeTx("split");
  },

  async merge(
    _userAddress: string,
    _marketId: number,
    _amount: bigint,
  ): Promise<TxResult> {
    await delay();
    return makeTx("merge");
  },

  async redeem(
    _userAddress: string,
    _marketId: number,
  ): Promise<TxResult> {
    await delay();
    return makeTx("redeem");
  },
};

export const AmmContract = {
  async getPrice(marketId: number, outcome: number) {
    await delay();
    const prices = toPriceBigints(getMockMarket(marketId));
    return prices[outcome] ?? 0n;
  },

  async getPrices(marketId: number): Promise<bigint[]> {
    await delay();
    return toPriceBigints(getMockMarket(marketId));
  },

  async getTradeCount(marketId: number): Promise<number> {
    await delay();
    return getMockMarket(marketId).trade_count;
  },

  async getVolume(marketId: number): Promise<bigint> {
    await delay();
    return BigInt(getMockMarket(marketId).total_volume);
  },

  async quoteBuyParsed(marketId: number, outcome: number, shares: bigint): Promise<bigint> {
    await delay();
    const market = getMockMarket(marketId);
    const price = outcome === 0 ? market.yesPrice : market.noPrice;
    const sharesFloat = Number(shares) / Number(E18);
    const baseCost = sharesFloat * price;
    const slippageMultiplier = 1 + Math.min(0.15, sharesFloat / 1_000) * 0.15;
    return BigInt(Math.round(baseCost * slippageMultiplier * Number(E7)));
  },

  async quoteBuy(marketId: number, outcome: number, shares: bigint) {
    return AmmContract.quoteBuyParsed(marketId, outcome, shares);
  },

  async quoteSellParsed(marketId: number, outcome: number, shares: bigint): Promise<bigint> {
    await delay();
    const market = getMockMarket(marketId);
    const price = outcome === 0 ? market.yesPrice : market.noPrice;
    const sharesFloat = Number(shares) / Number(E18);
    const baseRefund = sharesFloat * price;
    const slippageMultiplier = 1 - Math.min(0.12, sharesFloat / 1_000) * 0.1;
    return BigInt(Math.max(0, Math.round(baseRefund * slippageMultiplier * Number(E7))));
  },

  async buy(
    _userAddress: string,
    _marketId: number,
    _outcome: number,
    _shares: bigint,
  ): Promise<TxResult> {
    await delay(250);
    return makeTx("buy");
  },

  async sell(
    _userAddress: string,
    _marketId: number,
    _outcome: number,
    _shares: bigint,
  ): Promise<TxResult> {
    await delay(250);
    return makeTx("sell");
  },
};

export const OutcomeTokenContract = {
  async balance(marketId: number, outcome: number, _user: string): Promise<bigint> {
    await delay();
    const market = getMockMarket(marketId);
    const weight = outcome === 0 ? market.yesPrice : market.noPrice;
    return BigInt(Math.floor((2 + weight * 3) * Number(E18)));
  },

  async totalSupply(_marketId: number, _outcome: number): Promise<bigint> {
    await delay();
    return 120n * E18;
  },
};

export const VaultContract = {
  async deposit(
    _userAddress: string,
    _amount: bigint,
  ): Promise<TxResult> {
    await delay(220);
    return makeTx("deposit");
  },

  async withdraw(
    _userAddress: string,
    _amount: bigint,
  ): Promise<TxResult> {
    await delay(220);
    return makeTx("withdraw");
  },

  async getTvl() {
    await delay();
    return BigInt("19230000000");
  },

  async getUserYield(_userAddress: string) {
    await delay();
    return BigInt("182000000");
  },

  async claimYield(_userAddress: string): Promise<TxResult> {
    await delay(220);
    return makeTx("claim-yield");
  },
};
