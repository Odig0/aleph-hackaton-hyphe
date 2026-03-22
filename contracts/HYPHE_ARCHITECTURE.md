# Hyphe - Prediction Market Protocol (GenLayer)

**Prediction Markets Meet Yield on GenLayer**

Hyphe is an on-chain prediction market protocol built on GenLayer, where collateral automatically generates yield through intelligent contracts using AI-powered resolution and consensus mechanisms.

## 🎯 What is Hyphe?

Hyphe solves the **"AI-native prediction market bootstrapping problem"**:

**The Problem**: Prediction markets need liquidity subsidies to function, but funding them requires external capital (VCs, incentives).

**Our Solution**: 
- Users deposit collateral to trade on outcome markets (YES/NO)
- Their collateral automatically earns yield (~3-5% mock for hackathon)
- 70% of yield funds the LMSR liquidity pool (self-sustaining)
- 20% goes to users as passive rewards
- 10% funds protocol operations

Result: **Self-sustaining prediction markets with zero external subsidies.**

---

## 🏗️ Architecture

### Three Core Contracts

#### 1. **HypheMarket** (`contracts/hyphe_market.py`)
Main prediction market smart contract.

**Key Features:**
- Binary outcomes (YES/NO)
- LMSR (Logarithmic Market Scoring Rule) pricing
- Automatic yield accrual on collateral
- Buy/sell outcome tokens
- Market resolution & finalization

**Key Methods:**
```python
create_market(market_id, title, description, resolution_url, predicted_outcome)
buy_outcome(market_id, outcome, collateral_amount)
resolve_market(market_id)              # AI-powered resolution
finalize_resolution(market_id)
redeem_winning_shares(market_id)

# View methods
get_market(market_id)
get_user_positions(user)
get_market_odds(market_id)
get_user_yield(user)
```

**Uses Equivalence Principle:** `gl.eq_principle.strict_eq()` for deterministic market resolution via LLM.

---

#### 2. **HypheOracle** (`contracts/hyphe_oracle.py`)
Decentralized market resolution with dispute mechanism.

**Key Features:**
- Optimistic Democracy consensus
- Multi-source outcome verification
- 24-hour dispute window
- Token bonding for challenges
- Oracle accuracy incentives

**Key Methods:**
```python
submit_resolution(market_id, outcome, source_urls, confidence)
dispute_resolution(market_id, challenge_outcome, reasoning)
resolve_dispute(market_id)              # LLM-powered verification
finalize_resolution(market_id)

# View methods
get_submission(market_id)
get_market_resolution(market_id)
get_disputes(market_id)
```

**Uses Equivalence Principle:** `gl.eq_principle.strict_eq()` for oracle consensus verification.

---

#### 3. **HypheOutcomeToken** (`contracts/hyphe_token.py`)
ERC20-style token representing outcome shares.

**Features:**
- Mint/burn outcome tokens
- Transfer between users
- Approval & allowance system
- Redemption at $1 per winning share

**Key Methods:**
```python
mint(to, amount)
burn(from_addr, amount)
transfer(to, amount)
transfer_from(from_addr, to, amount)
approve(spender, amount)

# View methods
balance_of(account)
total_supply()
get_metadata()
```

---

## 💡 How It Works: Trading Flow

### Step 1: Create Market
```
Market Creator deploys: "Will Argentina win Copa 2026?"
  ├─ Outcome options: YES / NO
  ├─ Resolution source: ESPN API
  └─ Predicted outcome: YES (creator's prediction)
```

### Step 2: User Buys Outcome
```
User deposits $100 USDC to buy YES
  │
  ├─► HypheMarket receives USDC
  ├─► LMSR pricing calculates shares
  │   - Current odds: 60% YES, 40% NO
  │   - User receives: ~167 YES tokens
  │
  ├─► Collateral routes to HypheVault
  │   └─ Earns 3-5% yield (mocked for now)
  │
  └─► User position tracked
      └─ UserPosition { market_id, outcome: YES, collateral: 100, shares: 167 }
```

### Step 3: Market Resolves
```
Resolution occurs via HypheOracle:
  │
  ├─► Oracle LLM fetches real data from source_url
  ├─► Compares with market claims
  ├─► Submits outcome (with Equivalence Principle)
  │
  ├──► 24h Dispute Window Opens
  │    └─ Anyone can challenge with token bond
  │       (LLM verifies who's right)
  │
  └─► Final outcome: YES wins
      └─ User can redeem 167 shares @ $1 each = $167
```

### Step 4: User Redeems
```
User calls: redeem_winning_shares(market_id)
  ├─► HypheMarket verifies market is FINALIZED
  ├─► Checks user has winning outcome in position
  ├─► Transfers: 167 YES tokens → $167 returned to user
  └─► Also receives accumulated yield: ~$5 (5% of $100)
      
Total earned: $167 + $5 = $172 (72% profit)
```

---

## 🔐 Hackathon Compliance

### ✅ Requirements Met

#### 1. **Intelligent Contract with Optimistic Democracy**
- Oracle submits resolution (`submit_resolution()`)
- 24-hour dispute window for optimists to challenge
- Winner determined by LLM verification
- Self-enforcing through incentive alignment

#### 2. **Equivalence Principle**
Used in TWO critical places:

**Market Resolution:**
```python
def _resolve_market_outcome(self, resolution_url, market_title, ...):
    result_json = json.loads(
        gl.eq_principle.strict_eq(get_outcome_from_source)
    )
    return result_json.get("outcome", "")
```

**Oracle Verification:**
```python
def _verify_outcome_from_sources(self, market_title, source_urls, ...):
    verified_json = json.loads(
        gl.eq_principle.strict_eq(verify_outcome)
    )
    return verified_json
```

#### 3. **Deploy on Testnet Bradbury**
```bash
# Quick deployment
genlayer network          # Select "testnet" (Bradbury)
npm run deploy            # Deploys all contracts
```

---

## 📊 LMSR Pricing Model (Simplified)

The **Logarithmic Market Scoring Rule** ensures:

1. **Instant Liquidity** - Every trade executes immediately
2. **Bounded Loss** - Max subsidy = b × ln(n) where b=liquidity param, n=outcomes
3. **Price Discovery** - Informed traders profit from mispricings

**Simplified Formula** (no floating point):
```
YES_Probability = (YES_Shares × 100) / Total_Shares
BUY_Price = Collateral × (100 / Probability)
```

**Example:**
- Current: 60 YES shares, 40 NO shares (60% YES)
- User buys YES with $100
- Receives: 100 × (100/60) = 167 YES tokens
- New odds: (60+40) / (100) = 60% YES still (LMSR adjusts)

---

## 🚀 Running Hyphe

### 1. Deploy Contracts
```bash
# Install dependencies
npm install

# Select GenLayer testnet
genlayer network

# Deploy contracts
npm run deploy
```

### 2. Test Resolution Flow
```bash
# Create a market
gltest test_create_market

# Buy outcomes
gltest test_buy_outcomes

# Resolve with oracle
gltest test_resolve_market

# Redeem winnings
gltest test_redeem_shares
```

### 3. Start Frontend (Next.js)
```bash
cd frontend
npm run dev           # http://localhost:3000

# Features:
# - Create/view markets
# - Buy/sell outcome tokens
# - Track portfolio & yield
# - Real-time odds charts
# - Market history
```

---

## 🔑 Key Innovation: Self-Sustaining Liquidity

### Traditional Prediction Markets
```
VCs → Subsidies → Liquidity → Markets → Users
(Unsustainable long-term)
```

### Hyphe Model
```
User Collateral
   ↓
Blend Protocol Yield (3-5% APY)
   ├─ 70% → LMSR Liquidity Pool
   ├─ 20% → Users as rewards
   └─ 10% → Protocol operations
   
Result: Self-sustaining, no external funding needed!
```

---

## 📁 File Structure

```
contracts/
├── hyphe_market.py       # Main prediction market contract
├── hyphe_oracle.py       # Resolution & dispute resolution
└── hyphe_token.py        # ERC20-style outcome tokens

test/
├── test_hyphe_market.py  # Market creation & trading tests
├── test_hyphe_oracle.py  # Resolution & dispute tests
└── test_hyphe_token.py   # Token mechanism tests

frontend/
├── src/
│   ├── components/
│   │   ├── markets/MarketGrid.tsx
│   │   ├── trading/TradingPanel.tsx
│   │   └── oracle/ResolutionPanel.tsx
│   │
│   ├── hooks/
│   │   ├── useMarkets.ts          # Fetch market data
│   │   ├── useTrade.ts            # Execute trades
│   │   └── useResolution.ts       # Submit/dispute
│   │
│   └── lib/
│       ├── contracts/HypheMarket.ts
│       ├── contracts/HypheOracle.ts
│       └── utils/priceCalculations.ts
```

---

## 🎓 Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Protocol | GenLayer (Python) | Latest |
| L1 Reference | GenVM | Bradbury |
| Frontend | Next.js 15 + React 19 | Latest |
| State | Zustand + TanStack Query | v5.90 |
| Styling | Tailwind CSS + shadcn/ui | v4 |
| Charts | Lightweight Charts | v5.1 |

---

## 📝 Minimal Example: Create & Resolve Market

```python
# 1. Create market with GenLayer CLI
genlayer-cli call hyphe_market create_market \
  --market_id "copa_2026_argentina" \
  --title "Will Argentina win Copa 2026?" \
  --description "Outcomes: YES (Argentina wins), NO (Other team wins)" \
  --resolution_url "https://espn.com/soccer/tournament/results" \
  --predicted_outcome "YES"

# 2. User buys outcome
gltest.call(hyphe_market, "buy_outcome", {
    "market_id": "copa_2026_argentina",
    "outcome": "YES",
    "collateral_amount": 100_000_000_000_000_000  # 100 in wei
})

# 3. Oracle resolves via AI
gltest.call(hyphe_oracle, "submit_resolution", {
    "market_id": "copa_2026_argentina",
    "outcome": "YES",
    "source_urls": "[\"https://espn.com/...\"]",
    "confidence": 95
})

# 4. User redeems
gltest.call(hyphe_market, "redeem_winning_shares", {
    "market_id": "copa_2026_argentina"
})
```

---

## 🔮 Future Enhancements

### For GenLayer Hackathon
- [ ] Full Blend Protocol integration for yield
- [ ] Categorical markets (>2 outcomes)
- [ ] Market liquidity pools and LP tokens
- [ ] Advanced dispute resolution with jury system
- [ ] Commitment-reveal scheme for private bets (ZK)
- [ ] Multi-outcome split/merge mechanism

### Production Readiness
- [ ] Gas optimization
- [ ] Oracle network (multiple providers)
- [ ] Governance token & DAO
- [ ] Insurance module for edge cases
- [ ] Stable AMM implementation

---

## 📞 Support

**Need Help?**

1. Check `CLAUDE.md` for GenLayer development guide
2. Review `frontend/QUICK_START.md` for UI setup
3. Run tests: `gltest test_hyphe_market.py`
4. GenLayer Docs: https://docs.genlayer.com

---

**Built for the Alephh Hackathon 🚀**  
*Prediction Markets + AI + DeFi Yield = Hyphe*
