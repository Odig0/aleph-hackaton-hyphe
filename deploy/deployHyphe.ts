"""
Hyphe Deployment Script
Deploys all three Hyphe contracts to GenLayer testnet
"""

import sys
from genlayer import *

async def deploy_hyphe():
    """Deploy complete Hyphe protocol"""
    
    print("\n🚀 Deploying Hyphe Prediction Market Protocol\n")
    print("=" * 60)
    
    # 1. Deploy Market Contract
    print("\n📦 1. Deploying HypheMarket contract...")
    with open("contracts/hyphe_market.py", "rb") as f:
        market_code = f.read()
    
    market_address = deploy_contract(
        code=market_code,
        args=[],
        salt_nonce=u256(1)  # Deterministic
    )
    print(f"   ✅ Market deployed at: {market_address}")
    
    # 2. Deploy Oracle Contract
    print("\n📦 2. Deploying HypheOracle contract...")
    with open("contracts/hyphe_oracle.py", "rb") as f:
        oracle_code = f.read()
    
    oracle_address = deploy_contract(
        code=oracle_code,
        args=[],
        salt_nonce=u256(2)  # Deterministic
    )
    print(f"   ✅ Oracle deployed at: {oracle_address}")
    
    # 3. Deploy Token Contract (YES tokens)
    print("\n📦 3. Deploying HypheOutcomeToken (YES) contract...")
    with open("contracts/hyphe_token.py", "rb") as f:
        token_code = f.read()
    
    token_yes_address = deploy_contract(
        code=token_code,
        args=["default_market", "YES"],
        salt_nonce=u256(3)  # Deterministic
    )
    print(f"   ✅ YES Token deployed at: {token_yes_address}")
    
    # 4. Deploy Token Contract (NO tokens)
    print("\n📦 4. Deploying HypheOutcomeToken (NO) contract...")
    token_no_address = deploy_contract(
        code=token_code,
        args=["default_market", "NO"],
        salt_nonce=u256(4)  # Deterministic
    )
    print(f"   ✅ NO Token deployed at: {token_no_address}")
    
    print("\n" + "=" * 60)
    print("\n✅ Deployment Complete!\n")
    
    # 5. Display deployment summary
    deployment_summary = {
        "network": "GenLayer Testnet (Bradbury)",
        "timestamp": "2026-03-21",
        "contracts": {
            "HypheMarket": str(market_address),
            "HypheOracle": str(oracle_address),
            "HypheOutcomeToken_YES": str(token_yes_address),
            "HypheOutcomeToken_NO": str(token_no_address)
        }
    }
    
    print("📋 Deployment Summary:")
    print("─" * 60)
    for key, value in deployment_summary.items():
        if key == "contracts":
            print(f"\n{key}:")
            for contract_name, address in value.items():
                print(f"  • {contract_name}: {address}")
        else:
            print(f"{key}: {value}")
    
    print("\n" + "=" * 60)
    print("\n📝 Configuration for Frontend:")
    print("─" * 60)
    print(f"\nAdd to frontend/.env:\n")
    print(f"NEXT_PUBLIC_HYPHE_MARKET_ADDRESS={market_address}")
    print(f"NEXT_PUBLIC_HYPHE_ORACLE_ADDRESS={oracle_address}")
    print(f"NEXT_PUBLIC_HYPHE_TOKEN_YES_ADDRESS={token_yes_address}")
    print(f"NEXT_PUBLIC_HYPHE_TOKEN_NO_ADDRESS={token_no_address}")
    
    print("\n" + "=" * 60)
    print("\n🎯 Next Steps:")
    print("─" * 60)
    print("""
1. Update frontend/.env with contract addresses above

2. Initialize first market:
   gltest.call(market, "create_market", {
       "market_id": "copa_2026",
       "title": "Copa America 2026 Winner",
       "description": "Will Argentina win Copa America 2026?",
       "resolution_url": "https://espn.com",
       "predicted_outcome": "YES"
   })

3. Start frontend:
   cd frontend && npm run dev

4. Trade on markets at http://localhost:3000

5. Run tests:
   gltest test/test_hyphe.py
    """)
    
    print("=" * 60)
    print("\n✨ Hyphe is ready for trading! ✨\n")
    
    return {
        "market": market_address,
        "oracle": oracle_address,
        "token_yes": token_yes_address,
        "token_no": token_no_address
    }

if __name__ == "__main__":
    # Run deployment
    import asyncio
    addresses = asyncio.run(deploy_hyphe())
