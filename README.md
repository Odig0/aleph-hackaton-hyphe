# HYPHE

**AI-Native Prediction Markets on GenLayer**

*Trade on real-world outcomes. Let AI participate in consensus.*

Built on **GenLayer Intelligent Contracts**
License: MIT

---

## Overview

HYPHE is an on-chain prediction market protocol built on **GenLayer Bradbury**, where **AI participates directly in validation and dispute resolution**.

Users create and trade markets on future events (sports, politics, crypto, etc.) while Intelligent Contracts use **Optimistic Democracy consensus** to verify outcomes and resolve disputes.

This removes the need for centralized oracles and enables prediction markets that are:

* Autonomous
* Censorship-resistant
* AI-auditable

---

## Table of Contents

* [The Problem](#the-problem)
* [Our Solution](#our-solution)
* [Features](#features)
* [Intelligent Contracts](#intelligent-contracts)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [How It Works](#how-it-works)
* [Hackathon Context](#hackathon-context)
* [Contract Addresses](#contract-addresses)
* [Roadmap](#roadmap)
* [License](#license)

---

## The Problem

Prediction markets are powerful tools for aggregating information and forecasting future events. However, existing platforms suffer from three major issues:

### Centralized oracles

Most prediction markets rely on trusted third parties to resolve outcomes, introducing bias and single points of failure.

### Manual dispute resolution

When outcomes are ambiguous, disputes often require human moderators or off-chain governance.

### Lack of AI integration

Despite AI being well-suited to evaluate evidence and probabilistic outcomes, current blockchain systems cannot natively integrate AI into consensus.

---

## Our Solution

HYPHE leverages **GenLayer’s Intelligent Contracts** to create prediction markets where:

* AI models validate evidence and outcomes
* Human participants can challenge results through optimistic democracy
* Final decisions emerge from decentralized AI-human consensus

This results in markets that are:

* Trust-minimized
* Self-resolving
* Resistant to manipulation

---

## Features

### Prediction Market Trading

* Create binary and multi-outcome markets
* Trade shares representing event outcomes
* Peer-to-peer escrow using on-chain contracts

### AI-Driven Resolution

* Intelligent Contracts evaluate evidence submitted after event completion
* AI models analyze data sources such as match results, news, or official reports
* Consensus emerges through GenLayer validation rounds

### Dispute System

* Anyone can challenge an AI decision
* Alternative models can be proposed during dispute rounds
* Optimistic Democracy finalizes the result

### Fully On-Chain Escrow

* Funds remain locked until resolution
* Winning traders redeem automatically
* No centralized custody or intermediaries

---

## Intelligent Contracts

HYPHE is composed of multiple Intelligent Contracts deployed on the **GenLayer Bradbury Testnet**.

| Contract        | Purpose                              |
| --------------- | ------------------------------------ |
| `hyphe_market`  | Market creation, trading, and escrow |
| `hyphe_oracle`  | AI-assisted outcome verification     |
| `hyphe_token`   | Outcome share token logic            |
| `football_bets` | Example sports prediction market     |

---

## Tech Stack

| Layer         | Technology                   |
| ------------- | ---------------------------- |
| Blockchain    | GenLayer Bradbury Testnet    |
| Contracts     | Python Intelligent Contracts |
| Consensus     | Optimistic Democracy         |
| AI Validation | LLM-based model routing      |
| Frontend      | Next.js + React              |
| Backend       | Node.js + TypeScript         |

---

## Getting Started

### Prerequisites

* Node.js ≥ 20
* Python ≥ 3.10
* GenLayer CLI
* Access to Bradbury testnet

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/hyphe-genlayer.git
cd hyphe-genlayer
```

---

### 2. Install dependencies

```bash
npm install
pip install -r requirements.txt
```

---

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
GENLAYER_RPC_URL=
GENLAYER_PRIVATE_KEY=
AI_MODEL_ENDPOINT=
```

---

### 4. Deploy Intelligent Contracts

```bash
genlayer deploy contracts/hyphe_market.py
genlayer deploy contracts/hyphe_oracle.py
genlayer deploy contracts/hyphe_token.py
```

---

### 5. Start the frontend

```bash
cd frontend
npm run dev
```

Open in your browser:

```
http://localhost:3000
```

---

## Project Structure

```
hyphe/
│
├── contracts/
│   ├── hyphe_market.py
│   ├── hyphe_oracle.py
│   ├── hyphe_token.py
│   └── football_bets.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/
│
├── backend/
│   ├── api/
│   └── services/
│
└── README.md
```

---

## How It Works

### Trading Flow

1. A user creates a market:
   **"Will Argentina win the next match?"**

2. Other users buy shares in:

   * YES
   * NO

3. Funds are locked in the market contract until resolution.

---

### Resolution Flow

After the event concludes:

1. Evidence is submitted (scores, links, official sources)
2. The `hyphe_oracle` contract requests AI evaluation
3. Validators run independent AI models
4. If consensus is reached → market finalizes
5. If challenged → a dispute round begins

---

### Payout

* Winning shares redeem **1:1** against the escrow pool
* Losing shares become worthless
* No manual intervention is required

---

## Hackathon Context

This project was built for:

**GenLayer Bradbury + Aleph Hackathon**

It explores:

* AI-native oracles
* Agent-to-agent economic coordination
* Intelligent Contracts in financial markets

Relevant tracks:

* Prediction Markets & P2P Betting
* AI Governance
* Agentic Economy Infrastructure

---

## Contract Addresses

Deployed on **Bradbury Testnet**:

| Contract      | Address                                                              |
| ------------- | -------------------------------------------------------------------- |
| football_bets | `0x2d5d53cf78e0c38212a4d07420119661ef6e6d8857da8fa85b464d32febd94fd` |
| hyphe_market  | `0xabdcbeadf92b50a662e1210448471ac5df71402ce28886fa761db37c7683d31d` |
| hyphe_oracle  | `0x5bdb810ea72b7e591243b36a9bccec2d98517082dae6402d60fe20af28a187dc` |
| hyphe_token   | `0xdb5848552558ad964baa931181df69b7434d87f081490af23c35aa1f175c2084` |

---

## Roadmap

### Phase 1 — Hackathon MVP

* Market creation
* AI-assisted resolution
* On-chain escrow

### Phase 2 — Post-Hackathon

* Multi-market dashboard
* Model routing optimization
* Improved evidence ingestion pipelines

### Phase 3 — Production

* Cross-chain liquidity
* DAO governance
* Reputation system for AI models

---

## License

This project is licensed under the **MIT License**.

---

## Acknowledgements

* GenLayer Foundation
* Bradbury Testnet contributors
* Internet Court and pm-kit open source examples
