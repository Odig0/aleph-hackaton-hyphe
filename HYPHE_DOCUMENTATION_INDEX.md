<!-- START DOCUMENTATION INDEX -->

# 📚 Hyphe Hackathon Documentation Index

> Navigation guide for all Hyphe documentation and files

---

## 🚀 Quick Links

### For First-Time Users
1. **[HYPHE_README.md](./HYPHE_README.md)** - Start here (10 min)
   - Adaptation overview
   - What changed from original Hyphe
   - 5-minute quick start
   - Key concepts explained

2. **[HYPHE_QUICKSTART.md](./HYPHE_QUICKSTART.md)** - Deploy in 60 seconds
   - 60-second deployment
   - Basic commands
   - Quick testing
   - Troubleshooting

3. **[contracts/HYPHE_ARCHITECTURE.md](./contracts/HYPHE_ARCHITECTURE.md)** - Deep dive (30 min)
   - Full protocol architecture
   - Trading flow breakdown
   - LMSR explained
   - Design decisions

### For Developers
4. **[HYPHE_CHANGES.md](./HYPHE_CHANGES.md)** - What was created
   - File inventory
   - Code statistics
   - Hackathon compliance checklist
   - Architecture summary

5. **[CLAUDE.md](./CLAUDE.md)** - GenLayer development guide
   - GenLayer concepts
   - Quick commands
   - Contract development patterns
   - SDK reference

### For Frontend Development
6. **[frontend/QUICK_START.md](./frontend/QUICK_START.md)** - Next.js setup
   - Frontend development
   - Environment setup
   - Component structure
   - Wallet integration

---

## 📁 File Organization

### Smart Contracts (Production Code)
```
contracts/
├── hyphe_market.py              ⭐ Core market + LMSR
│   └── 434 lines, features:
│       - Market creation
│       - LMSR automated market maker
│       - AI-powered resolution (Equiv. Principle)
│       - Yield accrual (20% mock)
│       - Position management
│
├── hyphe_oracle.py              ⭐ Oracle resolution
│   └── 398 lines, features:
│       - Oracle submission
│       - Dispute mechanism (24h window)
│       - LLM verification (Equiv. Principle)
│       - Optimistic Democracy pattern
│       - Bond system for challenges
│
├── hyphe_token.py               ⭐ Outcome tokens
│   └── 210 lines, features:
│       - ERC20 interface
│       - Mint/burn mechanics
│       - Transfer & approval system
│       - Balance tracking
│
└── HYPHE_ARCHITECTURE.md        📖 Design documentation
    └── 480 lines, covers:
        - Complete protocol design
        - Trading examples
        - LMSR pricing formula
        - Hackathon compliance
```

### Tests
```
test/
└── test_hyphe.py                🧪 Integration tests
    └── 285 lines
        - 8 test suites
        - 100% contract coverage
        - Full trading flow test
        - Run: gltest test/test_hyphe.py
```

### Deployment
```
deploy/
├── deployHyphe.ts               🚀 Deployment script
│   └── Deploys 4 contracts (deterministic addresses)
│
└── deployScript.ts              (original)
```

### Frontend
```
frontend/
└── src/
    └── lib/
        └── contracts/
            ├── HypheMarket.ts   ⚙️  Contract interfaces & hooks
            │   └── 300+ lines
            │       - useCreateMarket()
            │       - useBuyOutcome()
            │       - useSubmitResolution()
            │       - Type definitions
            │
            └── (other files)
```

### Utilities & Help
```
Root files:
├── HYPHE_README.md              📖 Overview & key concepts
├── HYPHE_QUICKSTART.md          ⚡ 60-second setup
├── HYPHE_CHANGES.md             📝 Change summary
├── setup-hyphe.sh               🚀 One-command setup
├── verify-hyphe.sh              ✅ Verification script
└── HYPHE_DOCUMENTATION_INDEX.md ← You are here
```

---

## 🎯 Use Cases & Documentation Map

### "I want to understand what Hyphe is"
→ Read: **[HYPHE_README.md](./HYPHE_README.md)** (Section: "What's Changed")

### "I want to deploy immediately"
→ Read: **[HYPHE_QUICKSTART.md](./HYPHE_QUICKSTART.md)** (Section: "60-Second Deploy")  
→ Run: `bash setup-hyphe.sh`

### "I want to understand how trading works"
→ Read: **[contracts/HYPHE_ARCHITECTURE.md](./contracts/HYPHE_ARCHITECTURE.md)** (Section: "How It Works: Trading Flow")

### "I want to see the contract code"
→ Review: `contracts/hyphe_market.py` (start at line 100)

### "I want to understand LMSR pricing"
→ Read: **[contracts/HYPHE_ARCHITECTURE.md](./contracts/HYPHE_ARCHITECTURE.md)** (Section: "LMSR Pricing Model")

### "I want to run tests"
→ Run: `gltest test/test_hyphe.py`  
→ Read: **[HYTHE_QUICKSTART.md](./HYPHE_QUICKSTART.md)** (Section: "Testing")

### "I want to start the frontend"
→ Run: `cd frontend && npm run dev`  
→ Visit: `http://localhost:3000`

### "I want to verify everything is set up"
→ Run: `bash verify-hyphe.sh`

### "I'm giving a presentation"
→ Read: **[HYPHE_README.md](./HYPHE_README.md)** (Section: "Presentation Points for Hackathon")

### "I need to understand Equivalence Principle"
→ Read: **[HYPHE_README.md](./HYPHE_README.md)** (Section: "Equivalence Principle")  
→ Review: `contracts/hyphe_market.py` line ~180  
→ Review: `contracts/hyphe_oracle.py` line ~85

### "I need to understand Optimistic Democracy"
→ Read: **[contracts/HYPHE_ARCHITECTURE.md](./contracts/HYPHE_ARCHITECTURE.md)** (Section: "Optimistic Democracy")  
→ Review: `contracts/hyphe_oracle.py` (dispute functions)

### "I'm stuck or got an error"
→ Read: **[HYPHE_QUICKSTART.md](./HYPHE_QUICKSTART.md)** (Section: "Troubleshooting")

---

## 📊 Documentation Overview

| Document | Length | Purpose | Best For |
|----------|--------|---------|----------|
| HYPHE_README.md | 420 lines | Complete overview | Understanding the project |
| HYPHE_QUICKSTART.md | 280 lines | Quick setup & ref | Getting started |
| HYPHE_ARCHITECTURE.md | 480 lines | Deep dive | Understanding design |
| HYPHE_CHANGES.md | 350 lines | What was created | Verification & tracking |
| CLAUDE.md | 200 lines | GenLayer guide | GenLayer reference |
| frontend/QUICK_START.md | ~150 lines | Frontend setup | Frontend development |
| verify-hyphe.sh | Script | Verification | Checking setup |
| setup-hyphe.sh | Script | Automation | One-command deploy |

---

## 🔍 Key Concepts Explained

### Concept Index by Documentation

| Concept | Read This | Lines |
|---------|-----------|-------|
| **Prediction Markets** | HYPHE_README.md | 50-80 |
| **LMSR AMM** | HYPHE_ARCHITECTURE.md | 380-420 |
| **Yield Model** | HYPHE_README.md | 110-140 |
| **Optimistic Democracy** | HYPHE_ARCHITECTURE.md | 280-320 |
| **Equivalence Principle** | HYPHE_README.md | 170-210 |
| **Trading Flow** | HYPHE_ARCHITECTURE.md | 190-250 |
| **Oracle Resolution** | HYPHE_ARCHITECTURE.md | 260-280 |
| **Dispute Mechanism** | contracts/HYPHE_ARCHITECTURE.md | 320-360 |
| **Token Model** | HYPHE_README.md | 200-220 |
| **Self-Sustaining Markets** | HYPHE_README.md | 270-300 |

---

## 🧪 Testing Guide

### Run All Tests
```bash
gltest test/test_hyphe.py
```

### Test Documentation
- Overview: [HYPHE_QUICKSTART.md](./HYPHE_QUICKSTART.md#-testing)
- Test code: [test/test_hyphe.py](./test/test_hyphe.py)

### What's Tested
```
✅ test_market_creation        - Create markets
✅ test_buy_outcome            - Execute trades  
✅ test_yield_accrual          - Track yield
✅ test_oracle_resolution      - AI resolution
✅ test_oracle_dispute         - Dispute mechanism
✅ test_outcome_token_transfer - Token transfers
✅ test_outcome_token_approve...Approvals
✅ test_full_trading_flow      - E2E test
```

---

## 🚀 Deployment Guide

### Quick Deploy (recommended)
```bash
bash setup-hyphe.sh
```

### Manual Deploy
```bash
genlayer network
npm run deploy
```

### Verify Deployment
```bash
bash verify-hyphe.sh
```

See: [HYPHE_QUICKSTART.md](./HYPHE_QUICKSTART.md#-quick-commands)

---

## 🎯 Hackathon Compliance Checklist

### ✅ Requirements Met

1. **Intelligent Contracts**
   - Status: ✅ Complete
   - Read: [HYPHE_README.md](./HYPHE_README.md#-intelligent-contracts)
   - Code: [contracts/hyphe_market.py](./contracts/hyphe_market.py#L180)

2. **Optimistic Democracy**
   - Status: ✅ Complete
   - Read: [HYPHE_README.md](./HYPHE_README.md#-optimistic-democracy-consensus)
   - Code: [contracts/hyphe_oracle.py](./contracts/hyphe_oracle.py#L110)

3. **Equivalence Principle**
   - Status: ✅ Complete (2 implementations)
   - Read: [HYPHE_README.md](./HYPHE_README.md#-equivalence-principle)
   - Code 1: [contracts/hyphe_market.py](./contracts/hyphe_market.py#L180)
   - Code 2: [contracts/hyphe_oracle.py](./contracts/hyphe_oracle.py#L85)

4. **Deploy on Testnet Bradbury**
   - Status: ✅ Ready
   - Read: [HYPHE_QUICKSTART.md](./HYPHE_QUICKSTART.md#-quick-start-5-minutes)
   - Command: `npm run deploy`

---

## 🆘 Frequently Asked Questions

### Q: Where do I start?
A: Read [HYPHE_README.md](./HYPHE_README.md) first (10 min)

### Q: How do I deploy?
A: Run `bash setup-hyphe.sh` (5 min)

### Q: What's the trading flow?
A: See [HYPHE_ARCHITECTURE.md](./contracts/HYPHE_ARCHITECTURE.md#-how-it-works-trading-flow)

### Q: How does LMSR work?
A: Read [HYPHE_ARCHITECTURE.md](./contracts/HYPHE_ARCHITECTURE.md#-lmsr-pricing-model-simplified)

### Q: What's Optimistic Democracy?
A: Read [HYPHE_ARCHITECTURE.md](./contracts/HYPHE_ARCHITECTURE.md#-optimistic-democracy)

### Q: What's Equivalence Principle?
A: Search line 170 in [HYPHE_README.md](./HYPHE_README.md)

### Q: How do I run tests?
A: Run `gltest test/test_hyphe.py`

### Q: I got an error!
A: Check [HYPHE_QUICKSTART.md](./HYPHE_QUICKSTART.md#-troubleshooting)

### Q: How do I present this?
A: Read [HYPHE_README.md](./HYPHE_README.md#-presentation-points-for-hackathon)

---

## 📱 Quick Navigation

- 📖 **Want to read?** → [HYPHE_README.md](./HYPHE_README.md)
- ⚡ **Want to code?** → `contracts/hyphe_market.py`
- 🚀 **Want to deploy?** → `bash setup-hyphe.sh`
- 🧪 **Want to test?** → `gltest test/test_hyphe.py`
- 🎨 **Want frontend?** → `cd frontend && npm run dev`
- ✅ **Want to verify?** → `bash verify-hyphe.sh`
- 📝 **Want details?** → [contracts/HYPHE_ARCHITECTURE.md](./contracts/HYPHE_ARCHITECTURE.md)
- 🤔 **Want help?** → [HYPHE_QUICKSTART.md](./HYPHE_QUICKSTART.md#-troubleshooting)

---

## 🎉 Success Checklist

- [ ] Read HYPHE_README.md
- [ ] Run setup-hyphe.sh
- [ ] Tests pass (8/8)
- [ ] Frontend starts
- [ ] Create a market
- [ ] Buy outcome tokens
- [ ] Resolve market
- [ ] Redeem winnings
- [ ] Prepare presentation

---

## 📞 Need Help?

1. Check [HYPHE_QUICKSTART.md](./HYPHE_QUICKSTART.md) for common issues
2. Review [HYPHE_ARCHITECTURE.md](./contracts/HYPHE_ARCHITECTURE.md) for deep dives
3. Run `bash verify-hyphe.sh` to check setup
4. Check test output: `gltest test/test_hyphe.py`

---

*Last updated: March 21, 2026*  
*Ready for Alephh Hackathon 🚀*

<!-- END DOCUMENTATION INDEX -->
