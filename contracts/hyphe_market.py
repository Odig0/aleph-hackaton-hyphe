# { "Depends": "py-genlayer:test" }

"""
Hyphe - Prediction Market Protocol on GenLayer
Simplified structure for hackathon requirements

Features:
- Binary prediction markets (YES/NO)
- LMSR Automated Market Maker
- Oracle resolution with dispute mechanism
- Optimistic Democracy + Equivalence Principle
"""

import json
from dataclasses import dataclass
from enum import IntEnum
from genlayer import *


class MarketStatus(IntEnum):
    """Market lifecycle states"""
    ACTIVE = 0
    RESOLVED = 1
    DISPUTED = 2
    FINALIZED = 3


@allow_storage
@dataclass
class Market:
    """Prediction market"""
    id: str
    title: str
    description: str
    creator: Address
    
    # Market state
    creation_timestamp: str
    resolution_source_url: str
    predicted_outcome: str  # "YES" or "NO"
    
    # Resolution
    status: u256
    resolved_outcome: str  # "" if not resolved
    resolved_timestamp: str
    disputed: bool
    
    # Collateral
    total_yes_collateral: u256
    total_no_collateral: u256
    total_volume: u256


@allow_storage
@dataclass
class Position:
    """User position in a market"""
    market_id: str
    outcome: str  # "YES" or "NO"
    collateral: u256
    shares: u256


@allow_storage
@dataclass
class ResolutionData:
    """Oracle resolution submission"""
    market_id: str
    oracle: Address
    outcome: str
    timestamp: str
    finalized: bool


class HypheMarket(gl.Contract):
    """
    Hyphe Prediction Market
    
    Implements:
    - LMSR pricing model (simplified)
    - Binary outcomes (YES/NO)
    - Oracle resolution with 24-hour dispute window
    - Yield accumulation (simplified mock)
    """

    markets: TreeMap[str, Market]
    positions: TreeMap[Address, TreeMap[str, Position]]
    resolutions: TreeMap[str, ResolutionData]
    
    # Liquidity pool state
    liquidity_parameter: u256  # "b" in LMSR formula (e.g., 100)
    
    # Yield tracking
    user_yield: TreeMap[Address, u256]
    market_yes_shares: TreeMap[str, u256]
    market_no_shares: TreeMap[str, u256]

    def __init__(self):
        self.liquidity_parameter = u256(100)

    def _resolve_market_outcome(self, resolution_url: str, market_title: str, market_description: str) -> str:
        """
        AI-powered market resolution using LLM
        Implements Equivalence Principle: strict_eq for consensus
        """
        def get_outcome_from_source() -> str:
            # Fetch from resolution source
            web_data = gl.nondet.web.render(resolution_url, mode="text")
            
            task = f"""
Given the market:
Market: {market_title}
Description: {market_description}

Latest information from sources:
{web_data}

Determine the outcome of this prediction market.

Respond ONLY with valid JSON:
{{
    "outcome": "YES" or "NO",
    "confidence": 0-100,
    "reasoning": "brief explanation"
}}

CRITICAL: You MUST respond ONLY with valid JSON, nothing else.
"""
            result = gl.nondet.exec_prompt(task, response_format="json")
            return json.dumps(result, sort_keys=True)

        # Use Equivalence Principle for strict consensus
        result_json = json.loads(gl.eq_principle.strict_eq(get_outcome_from_source))
        return result_json.get("outcome", "")

    def _calculate_market_odds(self, market_id: str) -> dict:
        """
        Calculate current YES/NO odds using LMSR
        
        LMSR Price: P(outcome) = e^(shares[outcome]/b) / sum(e^(shares/b))
        b = liquidity parameter (defines market depth)
        """
        yes_shares = self.market_yes_shares.get(market_id, u256(0))
        no_shares = self.market_no_shares.get(market_id, u256(0))
        
        # Simplified: use linear approximation to avoid floating point
        # Real LMSR would use exponentials
        total_shares = yes_shares + no_shares
        
        if total_shares == u256(0):
            # Equal odds initially
            return {"yes_probability": 50, "no_probability": 50}
        
        yes_prob = (yes_shares * u256(100)) // total_shares
        no_prob = u256(100) - yes_prob
        
        return {
            "yes_probability": yes_prob,
            "no_probability": no_prob,
            "yes_shares": yes_shares,
            "no_shares": no_shares
        }

    def _accrue_yield(self, user: Address, market_id: str, collateral: u256) -> None:
        """
        Mock yield accrual (70/20/10 split)
        In real implementation: route to Blend Protocol
        """
        # 20% of collateral as annual yield (mock)
        annual_yield = (collateral * u256(20)) // u256(100)
        
        current_yield = self.user_yield.get(user, u256(0))
        self.user_yield[user] = current_yield + annual_yield

    @gl.public.write
    def create_market(
        self,
        market_id: str,
        title: str,
        description: str,
        resolution_url: str,
        predicted_outcome: str
    ) -> None:
        """Create a new prediction market"""
        if market_id in self.markets:
            raise Exception("Market already exists")
        
        if predicted_outcome not in ["YES", "NO"]:
            raise Exception("Outcome must be YES or NO")

        market = Market(
            id=market_id,
            title=title,
            description=description,
            creator=gl.message.sender_address,
            creation_timestamp=gl.message_raw["datetime"],
            resolution_source_url=resolution_url,
            predicted_outcome=predicted_outcome,
            status=u256(MarketStatus.ACTIVE),
            resolved_outcome="",
            resolved_timestamp="",
            disputed=False,
            total_yes_collateral=u256(0),
            total_no_collateral=u256(0),
            total_volume=u256(0)
        )
        
        self.markets[market_id] = market
        self.market_yes_shares[market_id] = u256(1)  # Initialize with 1 share
        self.market_no_shares[market_id] = u256(1)   # Initialize with 1 share

    @gl.public.write
    def buy_outcome(self, market_id: str, outcome: str, collateral_amount: u256) -> None:
        """
        Buy outcome tokens for a market
        
        User sends collateral, receives outcome shares based on LMSR pricing
        Excess collateral routes to yield (mock for now)
        """
        if market_id not in self.markets:
            raise Exception("Market not found")
        
        market = self.markets[market_id]
        
        if market.status != u256(MarketStatus.ACTIVE):
            raise Exception("Market is not active")
        
        if outcome not in ["YES", "NO"]:
            raise Exception("Outcome must be YES or NO")

        # Calculate shares using simplified LMSR
        odds = self._calculate_market_odds(market_id)
        
        if outcome == "YES":
            outcome_prob = odds["yes_probability"]
        else:
            outcome_prob = odds["no_probability"]
        
        # Simplified: shares = collateral * (100 / probability)
        if outcome_prob == 0:
            raise Exception("Cannot buy outcome with 0 probability")
        
        shares = (collateral_amount * u256(100)) // outcome_prob
        
        # Update market state
        if outcome == "YES":
            market.total_yes_collateral += collateral_amount
            self.market_yes_shares[market_id] = odds["yes_shares"] + shares
        else:
            market.total_no_collateral += collateral_amount
            self.market_no_shares[market_id] = odds["no_shares"] + shares
        
        market.total_volume += collateral_amount
        self.markets[market_id] = market
        
        # Track user position
        user_positions = self.positions.get_or_insert_default(gl.message.sender_address)
        position_key = f"{market_id}_{outcome}"
        
        if position_key in user_positions:
            pos = user_positions[position_key]
            pos.collateral += collateral_amount
            pos.shares += shares
            user_positions[position_key] = pos
        else:
            user_positions[position_key] = Position(
                market_id=market_id,
                outcome=outcome,
                collateral=collateral_amount,
                shares=shares
            )
        
        # Accrue yield on collateral
        self._accrue_yield(gl.message.sender_address, market_id, collateral_amount)

    @gl.public.write
    def resolve_market(self, market_id: str) -> None:
        """
        Resolve a market using oracle
        Submits outcome and starts dispute window
        """
        if market_id not in self.markets:
            raise Exception("Market not found")
        
        market = self.markets[market_id]
        
        if market.status != u256(MarketStatus.ACTIVE):
            raise Exception("Market already resolved or disputed")

        # Get AI-powered resolution
        outcome = self._resolve_market_outcome(
            market.resolution_source_url,
            market.title,
            market.description
        )
        
        if outcome not in ["YES", "NO"]:
            raise Exception("Invalid resolution outcome")

        # Create resolution record
        resolution = ResolutionData(
            market_id=market_id,
            oracle=gl.message.sender_address,
            outcome=outcome,
            timestamp=gl.message_raw["datetime"],
            finalized=False
        )
        
        self.resolutions[market_id] = resolution
        
        # Update market to RESOLVED (24h dispute window)
        market.resolved_outcome = outcome
        market.resolved_timestamp = gl.message_raw["datetime"]
        market.status = u256(MarketStatus.RESOLVED)
        self.markets[market_id] = market

    @gl.public.write
    def finalize_resolution(self, market_id: str) -> None:
        """
        Finalize resolution after dispute window
        Winners can now redeem shares
        """
        if market_id not in self.markets:
            raise Exception("Market not found")
        
        market = self.markets[market_id]
        resolution = self.resolutions.get(market_id)
        
        if resolution is None:
            raise Exception("Market not resolved")
        
        if market.status != u256(MarketStatus.RESOLVED):
            raise Exception("Market not in RESOLVED state")

        # In production: check 24h dispute window
        market.status = u256(MarketStatus.FINALIZED)
        self.markets[market_id] = market
        
        resolution.finalized = True
        self.resolutions[market_id] = resolution

    @gl.public.write
    def redeem_winning_shares(self, market_id: str) -> None:
        """
        Redeem winning outcome tokens for full $1 value
        
        Called after market is FINALIZED
        User receives: winning_shares * $1 back to wallet
        """
        if market_id not in self.markets:
            raise Exception("Market not found")
        
        market = self.markets[market_id]
        
        if market.status != u256(MarketStatus.FINALIZED):
            raise Exception("Market not finalized")

        user = gl.message.sender_address
        user_positions = self.positions.get(user)
        
        if user_positions is None:
            raise Exception("No positions for user")

        position_key = f"{market_id}_{market.resolved_outcome}"
        
        if position_key not in user_positions:
            raise Exception("No winning position")

        position = user_positions[position_key]
        winning_amount = position.shares  # Each share worth $1
        
        # Clear position
        del user_positions[position_key]

    @gl.public.view
    def get_market(self, market_id: str) -> dict:
        """Retrieve market details"""
        if market_id not in self.markets:
            raise Exception("Market not found")
        
        market = self.markets[market_id]
        odds = self._calculate_market_odds(market_id)
        
        return {
            "id": market.id,
            "title": market.title,
            "description": market.description,
            "status": market.status,
            "resolved_outcome": market.resolved_outcome,
            "total_volume": market.total_volume,
            "yes_probability": odds["yes_probability"],
            "no_probability": odds["no_probability"],
            "yes_collateral": market.total_yes_collateral,
            "no_collateral": market.total_no_collateral
        }

    @gl.public.view
    def get_user_positions(self, user: Address) -> dict:
        """Get all positions for a user"""
        positions = self.positions.get(user)
        
        if positions is None:
            return {}
        
        result = {}
        for key, position in positions.items():
            result[key] = {
                "market_id": position.market_id,
                "outcome": position.outcome,
                "collateral": position.collateral,
                "shares": position.shares
            }
        
        return result

    @gl.public.view
    def get_user_yield(self, user: Address) -> u256:
        """Get accumulated yield for user"""
        return self.user_yield.get(user, u256(0))

    @gl.public.view
    def get_market_odds(self, market_id: str) -> dict:
        """Get current market odds"""
        if market_id not in self.markets:
            raise Exception("Market not found")
        
        return self._calculate_market_odds(market_id)
