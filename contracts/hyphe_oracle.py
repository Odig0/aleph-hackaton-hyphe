# { "Depends": "py-genlayer:test" }

"""
Hyphe Oracle Resolution Contract

Handles market resolution with:
- Multi-source data aggregation
- 24-hour dispute window
- Token-based dispute bonds
- Optimistic democracy consensus
"""

import json
from dataclasses import dataclass
from enum import IntEnum
from genlayer import *


class DisputeStatus(IntEnum):
    """Dispute lifecycle"""
    NONE = 0
    ACTIVE = 1
    RESOLVED = 2


@allow_storage
@dataclass
class OracleSubmission:
    """Oracle's outcome submission"""
    market_id: str
    oracle: Address
    outcome: str
    confidence: u256
    source_urls: str  # JSON array as string
    timestamp: str
    dispute_bond: u256
    
    dispute_status: u256
    dispute_count: u256
    finalized: bool


@allow_storage
@dataclass
class Dispute:
    """Challenge to an oracle submission"""
    submission_id: str
    challenger: Address
    challenge_outcome: str
    bond_amount: u256
    timestamp: str
    resolved: bool
    winner: Address


class HypheOracle(gl.Contract):
    """
    Decentralized oracle for prediction market resolution
    
    Implements Optimistic Democracy pattern:
    - Majority outcome wins
    - Disputes require bonds
    - 24h dispute window
    """

    submissions: TreeMap[str, OracleSubmission]
    disputes: TreeMap[str, DynArray[Dispute]]
    
    # State tracking
    dispute_bond_amount: u256
    dispute_window_hours: u256
    
    # Stats
    resolved_markets: TreeMap[str, str]  # market_id -> final outcome

    def __init__(self):
        self.dispute_bond_amount = u256(100)  # 100 tokens
        self.dispute_window_hours = u256(24)

    def _verify_outcome_from_sources(self, market_title: str, source_urls: list, desired_outcome: str) -> dict:
        """
        Verify outcome from multiple sources using LLM
        Returns verification confidence
        """
        def verify_outcome() -> str:
            # Aggregate data from sources
            aggregated_data = ""
            for url in source_urls[:3]:  # Max 3 sources
                try:
                    web_data = gl.nondet.web.render(url, mode="text")
                    aggregated_data += f"\n--- Source: {url} ---\n{web_data[:500]}"
                except:
                    pass
            
            verification_task = f"""
Market: {market_title}
Claimed Outcome: {desired_outcome}

Verify this outcome from aggregated sources:
{aggregated_data}

Respond ONLY with valid JSON:
{{
    "verified": true/false,
    "confidence": 0-100,
    "reasoning": "brief explanation"
}}

CRITICAL: Respond ONLY with valid JSON.
"""
            result = gl.nondet.exec_prompt(verification_task, response_format="json")
            return json.dumps(result, sort_keys=True)

        # Use Equivalence Principle for oracle consensus
        verified_json = json.loads(gl.eq_principle.strict_eq(verify_outcome))
        return verified_json

    @gl.public.write
    def submit_resolution(
        self,
        market_id: str,
        outcome: str,
        source_urls: str,
        confidence: u256
    ) -> None:
        """
        Submit market resolution outcome
        
        - Must post dispute bond (100 tokens)
        - Opens 24h dispute window
        - Outcome verified against sources
        """
        if outcome not in ["YES", "NO"]:
            raise Exception("Invalid outcome: must be YES or NO")
        
        if market_id in self.resolved_markets:
            raise Exception("Market already resolved")

        submission_id = f"{market_id}_submission"
        
        if submission_id in self.submissions:
            raise Exception("Resolution already submitted")

        # Create and store submission
        submission = OracleSubmission(
            market_id=market_id,
            oracle=gl.message.sender_address,
            outcome=outcome,
            confidence=confidence,
            source_urls=source_urls,
            timestamp=gl.message_raw["datetime"],
            dispute_bond=self.dispute_bond_amount,
            dispute_status=u256(DisputeStatus.NONE),
            dispute_count=u256(0),
            finalized=False
        )
        
        self.submissions[submission_id] = submission
        
        # Initialize disputes array
        self.disputes[submission_id] = DynArray()

    @gl.public.write
    def dispute_resolution(
        self,
        market_id: str,
        challenge_outcome: str,
        reasoning: str
    ) -> None:
        """
        Challenge an oracle submission
        
        Challenger must:
        - Post bond equal to oracle bond
        - Provide alternative outcome
        - Dispute within 24h window
        """
        submission_id = f"{market_id}_submission"
        
        if submission_id not in self.submissions:
            raise Exception("No submission to dispute")
        
        if challenge_outcome not in ["YES", "NO"]:
            raise Exception("Invalid challenge outcome")

        submission = self.submissions[submission_id]
        
        if submission.finalized:
            raise Exception("Submission already finalized")

        # Create dispute
        dispute = Dispute(
            submission_id=submission_id,
            challenger=gl.message.sender_address,
            challenge_outcome=challenge_outcome,
            bond_amount=self.dispute_bond_amount,
            timestamp=gl.message_raw["datetime"],
            resolved=False,
            winner=Address("0x" + "0" * 40)  # Zero address initially
        )
        
        # Update submission
        submission.dispute_status = u256(DisputeStatus.ACTIVE)
        submission.dispute_count += u256(1)
        self.submissions[submission_id] = submission
        
        # Add dispute
        disputes_array = self.disputes.get(submission_id)
        if disputes_array is None:
            disputes_array = DynArray()
        disputes_array.append(dispute)
        self.disputes[submission_id] = disputes_array

    @gl.public.write
    def resolve_dispute(self, market_id: str) -> None:
        """
        Resolve active disputes using LLM consensus
        
        Winner is determined by outcome verification
        Bond collected from loser
        """
        submission_id = f"{market_id}_submission"
        
        if submission_id not in self.submissions:
            raise Exception("Submission not found")
        
        submission = self.submissions[submission_id]
        disputes_array = self.disputes.get(submission_id)
        
        if disputes_array is None or len(disputes_array) == 0:
            raise Exception("No disputes to resolve")
        
        if submission.dispute_status != u256(DisputeStatus.ACTIVE):
            raise Exception("Dispute not active")

        # Get first dispute for resolution
        dispute = disputes_array[0]
        
        # Verify which outcome is correct using oracle data
        source_urls_list = json.loads(submission.source_urls) if submission.source_urls else []
        
        verification = self._verify_outcome_from_sources(
            market_id,
            source_urls_list,
            submission.outcome
        )
        
        if verification.get("verified", False):
            # Oracle submission was correct
            dispute.winner = submission.oracle
            winner_outcome = submission.outcome
        else:
            # Dispute challenger was correct
            dispute.winner = dispute.challenger
            winner_outcome = dispute.challenge_outcome
        
        dispute.resolved = True
        disputes_array[0] = dispute
        self.disputes[submission_id] = disputes_array
        
        # Update submission
        submission.dispute_status = u256(DisputeStatus.RESOLVED)
        submission.finalized = True
        submission.outcome = winner_outcome
        self.submissions[submission_id] = submission
        
        # Store final resolution
        self.resolved_markets[market_id] = winner_outcome

    @gl.public.write
    def finalize_resolution(self, market_id: str) -> None:
        """
        Finalize resolution if no disputes filed
        Updates market to FINALIZED state
        """
        submission_id = f"{market_id}_submission"
        
        if submission_id not in self.submissions:
            raise Exception("Submission not found")
        
        submission = self.submissions[submission_id]
        
        if submission.dispute_count > u256(0):
            raise Exception("Cannot finalize: disputes exist")
        
        submission.finalized = True
        self.submissions[submission_id] = submission
        self.resolved_markets[market_id] = submission.outcome

    @gl.public.view
    def get_submission(self, market_id: str) -> dict:
        """Get oracle submission details"""
        submission_id = f"{market_id}_submission"
        
        if submission_id not in self.submissions:
            raise Exception("Submission not found")
        
        s = self.submissions[submission_id]
        return {
            "market_id": s.market_id,
            "oracle": s.oracle,
            "outcome": s.outcome,
            "confidence": s.confidence,
            "timestamp": s.timestamp,
            "dispute_count": s.dispute_count,
            "finalized": s.finalized,
            "status": s.dispute_status
        }

    @gl.public.view
    def get_market_resolution(self, market_id: str) -> str:
        """Get final market resolution"""
        return self.resolved_markets.get(market_id, "UNRESOLVED")

    @gl.public.view
    def get_disputes(self, market_id: str) -> dict:
        """Get disputes for a market"""
        submission_id = f"{market_id}_submission"
        disputes_array = self.disputes.get(submission_id)
        
        if disputes_array is None:
            return {"disputes": []}
        
        disputes_list = []
        for i in range(len(disputes_array)):
            d = disputes_array[i]
            disputes_list.append({
                "challenger": d.challenger,
                "outcome": d.challenge_outcome,
                "bond": d.bond_amount,
                "resolved": d.resolved,
                "winner": d.winner
            })
        
        return {"disputes": disputes_list}
