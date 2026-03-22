# { "Depends": "py-genlayer:test" }

"""
Hyphe Prediction Market - Integration Tests

Test suite for Hyphe market creation, trading, and resolution flows
"""

import json
from genlayer import *


def test_market_creation():
    """Test creating a prediction market"""
    # Deploy market contract
    market_contract = deploy_contract(
        code=open("contracts/hyphe_market.py", "rb").read(),
    )
    
    contract = get_contract_at(market_contract)
    
    # Create market
    contract.emit().create_market(
        market_id="test_copa_2026",
        title="Copa America 2026 Winner",
        description="Will Argentina win the Copa America 2026?",
        resolution_url="https://espn.com/soccer",
        predicted_outcome="YES"
    )
    
    # Verify market created
    market = contract.view().get_market("test_copa_2026")
    assert market["title"] == "Copa America 2026 Winner"
    assert market["status"] == 0  # ACTIVE
    assert market["yes_probability"] == 50  # Initial equal odds
    
    print("✅ Market creation test passed")


def test_buy_outcome():
    """Test buying outcome tokens"""
    market_contract = deploy_contract(
        code=open("contracts/hyphe_market.py", "rb").read(),
    )
    
    contract = get_contract_at(market_contract)
    
    # Create market
    contract.emit().create_market(
        market_id="test_trading",
        title="Test Market",
        description="Testing trading flow",
        resolution_url="https://example.com",
        predicted_outcome="YES"
    )
    
    # Buy YES outcome with 100 collateral
    contract.emit().buy_outcome(
        market_id="test_trading",
        outcome="YES",
        collateral_amount=u256(100)
    )
    
    # Verify position created
    positions = contract.view().get_user_positions(Address("0x" + "0"*40))
    assert len(positions) > 0
    
    # Verify odds changed (more YES bought = higher YES probability)
    odds = contract.view().get_market_odds("test_trading")
    assert odds["yes_probability"] > 50
    
    print("✅ Buy outcome test passed")


def test_yield_accrual():
    """Test yield accumulation on collateral"""
    market_contract = deploy_contract(
        code=open("contracts/hyphe_market.py", "rb").read(),
    )
    
    contract = get_contract_at(market_contract)
    
    # Create market
    contract.emit().create_market(
        market_id="test_yield",
        title="Yield Test Market",
        description="Testing yield accrual",
        resolution_url="https://example.com",
        predicted_outcome="YES"
    )
    
    # Buy outcome with collateral
    contract.emit().buy_outcome(
        market_id="test_yield",
        outcome="YES",
        collateral_amount=u256(1000)
    )
    
    # Check accumulated yield
    user_addr = Address("0x" + "0"*40)
    yield_amount = contract.view().get_user_yield(user_addr)
    
    # Should have accumulated some yield
    assert yield_amount > u256(0)
    
    print("✅ Yield accrual test passed")


def test_oracle_resolution():
    """Test oracle resolution flow"""
    oracle_contract = deploy_contract(
        code=open("contracts/hyphe_oracle.py", "rb").read(),
    )
    
    oracle = get_contract_at(oracle_contract)
    
    # Submit resolution
    oracle.emit().submit_resolution(
        market_id="test_resolution",
        outcome="YES",
        source_urls='["https://espn.com"]',
        confidence=u256(95)
    )
    
    # Verify submission
    submission = oracle.view().get_submission("test_resolution")
    assert submission["outcome"] == "YES"
    assert submission["finalized"] == False
    
    print("✅ Oracle resolution test passed")


def test_oracle_dispute():
    """Test disputing oracle resolution"""
    oracle_contract = deploy_contract(
        code=open("contracts/hyphe_oracle.py", "rb").read(),
    )
    
    oracle = get_contract_at(oracle_contract)
    
    # Submit resolution
    oracle.emit().submit_resolution(
        market_id="test_dispute",
        outcome="YES",
        source_urls='["https://espn.com"]',
        confidence=u256(95)
    )
    
    # Challenge resolution
    oracle.emit().dispute_resolution(
        market_id="test_dispute",
        challenge_outcome="NO",
        reasoning="Alternative data shows NO outcome"
    )
    
    # Verify dispute was recorded
    disputes = oracle.view().get_disputes("test_dispute")
    assert len(disputes["disputes"]) > 0
    
    submission = oracle.view().get_submission("test_dispute")
    assert submission["dispute_count"] > 0
    
    print("✅ Oracle dispute test passed")


def test_outcome_token_transfer():
    """Test outcome token transfers"""
    token_contract = deploy_contract(
        code=open("contracts/hyphe_token.py", "rb").read(),
        args=["test_market", "YES"]
    )
    
    token = get_contract_at(token_contract)
    
    user1 = Address("0x" + "1" * 40)
    user2 = Address("0x" + "2" * 40)
    
    # Mint tokens
    token.emit().mint(user1, u256(100))
    
    # Verify balance
    balance = token.view().balance_of(user1)
    assert balance == u256(100)
    
    # Transfer tokens
    token.emit().transfer(user2, u256(50))
    
    # Verify transfer
    balance1 = token.view().balance_of(user1)
    balance2 = token.view().balance_of(user2)
    
    assert balance1 == u256(50)
    assert balance2 == u256(50)
    
    print("✅ Token transfer test passed")


def test_outcome_token_approve_transfer_from():
    """Test approve and transfer_from"""
    token_contract = deploy_contract(
        code=open("contracts/hyphe_token.py", "rb").read(),
        args=["test_market", "NO"]
    )
    
    token = get_contract_at(token_contract)
    
    user1 = Address("0x" + "1" * 40)
    user2 = Address("0x" + "2" * 40)
    spender = Address("0x" + "3" * 40)
    
    # Mint tokens to user1
    token.emit().mint(user1, u256(100))
    
    # User1 approves spender
    token.emit().approve(spender, u256(50))
    
    # Verify allowance
    allowance = token.view().allowance_of(user1, spender)
    assert allowance == u256(50)
    
    # Spender transfers from user1 to user2
    token.emit().transfer_from(user1, user2, u256(30))
    
    # Verify balances
    balance1 = token.view().balance_of(user1)
    balance2 = token.view().balance_of(user2)
    new_allowance = token.view().allowance_of(user1, spender)
    
    assert balance1 == u256(70)
    assert balance2 == u256(30)
    assert new_allowance == u256(20)
    
    print("✅ Token approve/transfer_from test passed")


def test_full_trading_flow():
    """Integration: Full market lifecycle"""
    market = deploy_contract(
        code=open("contracts/hyphe_market.py", "rb").read(),
    )
    
    oracle = deploy_contract(
        code=open("contracts/hyphe_oracle.py", "rb").read(),
    )
    
    contract = get_contract_at(market)
    oracle_contract = get_contract_at(oracle)
    
    # 1. Create market
    contract.emit().create_market(
        market_id="integration_test",
        title="Integration Test Market",
        description="Full flow test",
        resolution_url="https://example.com",
        predicted_outcome="YES"
    )
    
    # 2. Buy outcomes
    contract.emit().buy_outcome(
        market_id="integration_test",
        outcome="YES",
        collateral_amount=u256(100)
    )
    
    contract.emit().buy_outcome(
        market_id="integration_test",
        outcome="NO",
        collateral_amount=u256(75)
    )
    
    # 3. Resolve market
    contract.emit().resolve_market("integration_test")
    
    # 4. Get market state
    market_data = contract.view().get_market("integration_test")
    assert market_data["status"] in [1, 3]  # RESOLVED or FINALIZED
    
    # 5. Oracle submits resolution
    oracle_contract.emit().submit_resolution(
        market_id="integration_test",
        outcome="YES",
        source_urls='["https://example.com"]',
        confidence=u256(95)
    )
    
    # 6. Verify resolution
    market_resolution = oracle_contract.view().get_market_resolution("integration_test")
    assert market_resolution == "YES"
    
    print("✅ Full trading flow test passed")


if __name__ == "__main__":
    print("\n🚀 Running Hyphe Tests...\n")
    
    test_market_creation()
    test_buy_outcome()
    test_yield_accrual()
    test_oracle_resolution()
    test_oracle_dispute()
    test_outcome_token_transfer()
    test_outcome_token_approve_transfer_from()
    test_full_trading_flow()
    
    print("\n✅ All tests passed! 🎉\n")
