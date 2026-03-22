# 🎯 Hyphe - Hackathon Quick Start

> **Prediction Markets + AI + Yield = Hyphe**  
> Built on GenLayer with Optimistic Democracy & Equivalence Principle

## ⚡ 60-Second Deploy

```bash
# 1. Select testnet
genlayer network

# 2. Deploy contracts
npm run deploy

# 3. Start frontend
cd frontend && npm run dev
```

Visit **http://localhost:3000** and start trading! 🚀

---

## 📦 What's Included

| Component | Location | Purpose |
|-----------|----------|---------|
| **Market Contract** | `contracts/hyphe_market.py` | Core trading logic + LMSR AMM |
| **Oracle Contract** | `contracts/hyphe_oracle.py` | AI resolution + disputes |
| **Token Contract** | `contracts/hyphe_token.py` | ERC20 outcome shares |
| **Tests** | `test/test_hyphe.py` | Integration tests |
| **Architecture Doc** | `contracts/HYPHE_ARCHITECTURE.md` | Full design spec |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           Frontend (Next.js + React)               │
│  - Market browser, trading panel, odds charts      │
│  - Portfolio & yield tracking                       │
└────────────────────┬────────────────────────────────┘
                     │
╔════════════════════╩════════════════════╦═══════════╦════════════╗
║                                        ║           ║            ║
▼                                        ▼           ▼            ▼
┌──────────────────┐    ┌──────────────┐ ┌─────────┐ ┌──────────┐
│ HypheMarket      │    │ HypheOracle  │ │ YES     │ │ NO       │
│                  │    │              │ │ Token   │ │ Token    │
│ • create_market  │    │ • submit     │ │         │ │          │
│ • buy_outcome    │    │ • dispute    │ │         │ │          │
│ • resolve_market │    │ • finalize   │ │         │ │          │
│ • redeem_shares  │    │              │ │         │ │          │
└──────────────────┘    └──────────────┘ └─────────┘ └──────────┘
     LMSR AMM               Optimistic                ERC20
   + Yield Accrual         Democracy              Outcome Tokens
```

---

## 🎮 Workflow

### 1️⃣ Create Market
```
Creator launches: "Will Argentina win Copa 2026?"
├─ YES / NO outcomes
├─ Resolution source: ESPN API
└─ Initial odds: 50/50
```

### 2️⃣ Users Trade
```
User buys $100 YES
├─ Receives ~167 YES tokens (at 60% odds)
├─ Collateral earns yield (3-5% mock)
└─ Position tracked in portfolio
```

### 3️⃣ Market Resolves
```
AI Oracle fetches real data
├─ Submits outcome: "YES"
├─ 24h dispute window opens
└─ LLM verifies winner
```

### 4️⃣ Users Redeem
```
Winner redeems shares $1 each
├─ 167 YES tokens → $167
├─ + $5 accumulated yield
└─ Total: $172 (72% return)
```

---

## 💻 Quick Commands

```bash
# Deploy to testnet
npm run deploy

# Run tests
gltest test/test_hyphe.py

# Frontend dev server
cd frontend && npm run dev

# Build frontend
npm run build

# Select network (testnet or localnet)
genlayer network
```

---

## 🔑 Key Features

### ✅ Hackathon Requirements
- **Optimistic Democracy**: Oracle submits, 24h disputes, LLM verifies winner
- **Equivalence Principle**: `gl.eq_principle.strict_eq()` used for resolution consensus
- **GenLayer Testnet**: Deploy on Bradbury tesnet with intelligent contracts

### 🚀 Protocol Features
- **LMSR Pricing**: Automatic market maker ensures liquidity
- **Yield**: Collateral earns 3-5% (mocked - production uses Blend Protocol)
- **Binary Markets**: YES/NO prediction outcomes
- **AI Resolution**: LLM fetches real-world data to resolve markets
- **Dispute Mechanism**: Challenge oracle with on-chain verification

---

## 📊 LMSR Formula (Simplified)

```python
# Current odds calculation
YES_Probability = (YES_Shares × 100) / Total_Shares

# When user buys
Shares_Awarded = Collateral × (100 / Current_Probability)

# Example:
# - 60 YES shares, 40 NO shares (60% YES)
# - User buys YES with $100
# - Receives: 100 × (100/60) = 167 YES tokens
```

---

## 🧪 Testing

```bash
# Run single test
gltest test/test_hyphe.py::test_market_creation

# Run all tests
gltest test/test_hyphe.py

# Run with verbose output
gltest -v test/test_hyphe.py
```

**Test Coverage:**
- ✅ Market creation
- ✅ Buying outcomes
- ✅ Yield accrual
- ✅ Oracle resolution
- ✅ Dispute mechanism
- ✅ Token transfers
- ✅ Full trading flow

---

## 🎯 Example: Complete Flow

```bash
# 1. Deploy
npm run deploy

# 2. Create market (via CLI or frontend)
genlayer-cli call MARKET_ADDRESS create_market \
  --market_id "copa_2026" \
  --title "Copa America 2026 Winner" \
  --description "Will Argentina win?" \
  --resolution_url "https://espn.com/soccer" \
  --predicted_outcome "YES"

# 3. User buys YES
genlayer-cli call MARKET_ADDRESS buy_outcome \
  --market_id "copa_2026" \
  --outcome "YES" \
  --collateral_amount 100000000000000000  # 100 wei

# 4. Market resolves (AI pulls live data)
genlayer-cli call MARKET_ADDRESS resolve_market \
  --market_id "copa_2026"

# 5. User redeems winnings
genlayer-cli call MARKET_ADDRESS redeem_winning_shares \
  --market_id "copa_2026"
```

---

## 📁 File Structure

```
hyphe-prediction-market/
│
├── contracts/
│   ├── hyphe_market.py              # Main market contract
│   ├── hyphe_oracle.py              # Resolution + disputes
│   ├── hyphe_token.py               # ERC20 tokens
│   └── HYPHE_ARCHITECTURE.md        # Full design doc
│
├── test/
│   └── test_hyphe.py                # Integration tests
│
├── deploy/
│   └── deployHyphe.ts               # Deployment script
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── markets/
│   │   │   └── page.tsx              # Markets page
│   │   ├── components/
│   │   │   ├── markets/
│   │   │   ├── trading/
│   │   │   └── oracle/
│   │   ├── hooks/
│   │   │   ├── useMarkets.ts
│   │   │   └── useTrade.ts
│   │   └── lib/
│   │       └── contracts/
│   │
│   └── .env.local                    # Contract addresses
│
├── CLAUDE.md                         # GenLayer guide
├── HYPHE_QUICKSTART.md              # This file
└── README.md
```

---

## 🚨 Troubleshooting

### Issue: "Contract not found"
→ Run `npm run deploy` first to deploy contracts

### Issue: "Insufficient balance"
→ Use faucet: `genlayer-cli faucet` (testnet only)

### Issue: Tests fail
→ Ensure GenLayer Studio/testnet is running:
```bash
genlayer network          # Check connection
gltest test/test_hyphe.py # Run tests
```

### Issue: Frontend won't start
```bash
cd frontend
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

---

## 📚 Further Reading

- **Full Architecture**: See `contracts/HYPHE_ARCHITECTURE.md`
- **GenLayer Dev Guide**: See `CLAUDE.md`
- **Frontend Setup**: See `frontend/QUICK_START.md`
- **GenLayer Docs**: https://docs.genlayer.com

---

## 🎉 You're Ready!

```
1. ✅ Contracts deployed        (3 contracts)
2. ✅ Tests passing              (8 test suites)
3. ✅ Frontend running           (http://localhost:3000)
4. ✅ Markets tradeable          (LMSR AMM active)
5. ✅ Hackathon compliant        (GenLayer + Equivalence Principle)
```

**Time to present Hyphe at the hackathon! 🚀**

---

## 🤝 Support

- **Questions?** Check `HYPHE_ARCHITECTURE.md`
- **Stuck?** Run tests: `gltest test/test_hyphe.py`
- **GenLayer Help**: https://docs.genlayer.com
- **Hackathon Slack**: #hackathon-alephh

---

**Built for Aleph Hackathon 2026 by Team Hyphe** 🌟
