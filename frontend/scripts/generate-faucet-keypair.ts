import { Keypair } from "@stellar/stellar-sdk";

const pair = Keypair.random();

console.log("=== Hyphe Faucet Keypair ===");
console.log("Public Key:", pair.publicKey());
console.log("Secret Key:", pair.secret());
console.log("");
console.log("Next steps:");
console.log("1. Fund this public address with USDC on Stellar testnet");
console.log("2. Add the secret to frontend/.env.local:");
console.log(`   FAUCET_SECRET=${pair.secret()}`);
