# { "Depends": "py-genlayer:test" }

"""
Hyphe Outcome Token Contract

ERC20-style token representing outcome shares in prediction markets
- YES tokens for "yes" outcomes
- NO tokens for "no" outcomes
- Redeemable 1:1 after market resolution
"""

import json
from dataclasses import dataclass
from genlayer import *


@allow_storage
@dataclass
class TokenMetadata:
    """Token information"""
    name: str
    symbol: str
    decimals: u256
    total_supply: u256


class HypheOutcomeToken(gl.Contract):
    """
    ERC20-compliant outcome token for prediction markets
    
    Features:
    - Mint outcome tokens when user buys
    - Burn when redeemed after resolution
    - Transfer between users
    - Query balances and supplies
    """

    # Token metadata
    token_metadata: TokenMetadata
    
    # Balances tracking
    balances: TreeMap[Address, u256]
    allowances: TreeMap[Address, TreeMap[Address, u256]]
    
    # Market and outcome
    market_id: str
    outcome: str  # "YES" or "NO"
    
    def __init__(self, market_id: str, outcome: str):
        self.market_id = market_id
        self.outcome = outcome
        
        symbol = "Y" if outcome == "YES" else "N"
        self.token_metadata = TokenMetadata(
            name=f"Outcome {outcome} - {market_id}",
            symbol=symbol,
            decimals=u256(18),
            total_supply=u256(0)
        )

    @gl.public.write
    def mint(self, to: Address, amount: u256) -> None:
        """
        Mint new outcome tokens
        Can only be called by market contract
        """
        # In production: verify caller is market contract
        # For now: allow any call (governance would restrict)
        
        balance = self.balances.get(to, u256(0))
        self.balances[to] = balance + amount
        
        metadata = self.token_metadata
        metadata.total_supply += amount
        self.token_metadata = metadata

    @gl.public.write
    def burn(self, from_addr: Address, amount: u256) -> None:
        """
        Burn outcome tokens
        Called when user redeems after resolution
        """
        balance = self.balances.get(from_addr, u256(0))
        
        if balance < amount:
            raise Exception("Insufficient balance to burn")
        
        self.balances[from_addr] = balance - amount
        
        metadata = self.token_metadata
        if metadata.total_supply >= amount:
            metadata.total_supply -= amount
        self.token_metadata = metadata

    @gl.public.write
    def transfer(self, to: Address, amount: u256) -> None:
        """Transfer outcome tokens between users"""
        sender = gl.message.sender_address
        
        balance = self.balances.get(sender, u256(0))
        if balance < amount:
            raise Exception("Insufficient balance")
        
        self.balances[sender] = balance - amount
        
        recipient_balance = self.balances.get(to, u256(0))
        self.balances[to] = recipient_balance + amount

    @gl.public.write
    def approve(self, spender: Address, amount: u256) -> None:
        """Approve spender to spend tokens on behalf of user"""
        owner = gl.message.sender_address
        
        owner_allowances = self.allowances.get_or_insert_default(owner)
        owner_allowances[spender] = amount
        self.allowances[owner] = owner_allowances

    @gl.public.write
    def transfer_from(self, from_addr: Address, to: Address, amount: u256) -> None:
        """Transfer tokens from one address to another (requires approval)"""
        sender = gl.message.sender_address
        
        # Check allowance
        from_allowances = self.allowances.get(from_addr)
        if from_allowances is None:
            raise Exception("No allowance")
        
        allowance = from_allowances.get(sender, u256(0))
        if allowance < amount:
            raise Exception("Insufficient allowance")
        
        # Check balance
        balance = self.balances.get(from_addr, u256(0))
        if balance < amount:
            raise Exception("Insufficient balance")
        
        # Execute transfer
        self.balances[from_addr] = balance - amount
        recipient_balance = self.balances.get(to, u256(0))
        self.balances[to] = recipient_balance + amount
        
        # Update allowance
        from_allowances[sender] = allowance - amount
        self.allowances[from_addr] = from_allowances

    @gl.public.view
    def balance_of(self, account: Address) -> u256:
        """Get token balance of account"""
        return self.balances.get(account, u256(0))

    @gl.public.view
    def total_supply(self) -> u256:
        """Get total token supply"""
        return self.token_metadata.total_supply

    @gl.public.view
    def get_metadata(self) -> dict:
        """Get token metadata"""
        meta = self.token_metadata
        return {
            "name": meta.name,
            "symbol": meta.symbol,
            "decimals": meta.decimals,
            "total_supply": meta.total_supply,
            "market_id": self.market_id,
            "outcome": self.outcome
        }

    @gl.public.view
    def allowance_of(self, owner: Address, spender: Address) -> u256:
        """Get allowance amount"""
        owner_allowances = self.allowances.get(owner)
        
        if owner_allowances is None:
            return u256(0)
        
        return owner_allowances.get(spender, u256(0))
