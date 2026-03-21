import {
  Asset,
  Networks,
  Keypair,
  TransactionBuilder,
  Operation,
  Account,
} from "@stellar/stellar-sdk";

const TARGET_SAC = "CAQCFVLOBK5GIULPNZRGATJJMIZL5BSP7X5YJVMGCPTUEPFM4AVSRCJU";
const HORIZON_URL = "https://horizon-testnet.stellar.org";
const FAUCET_SECRET = process.env.FAUCET_SECRET || process.argv[2];

if (!FAUCET_SECRET) {
  console.error("Usage: FAUCET_SECRET=S... npx tsx scripts/add-usdc-trustline.ts");
  console.error("   or: npx tsx scripts/add-usdc-trustline.ts S...");
  process.exit(1);
}

async function main() {
  // Step 1: Find the USDC issuer that matches our SAC contract
  console.log("Searching for USDC issuer matching SAC:", TARGET_SAC);
  let issuer: string | null = null;
  let cursor = "";

  while (issuer === null) {
    const url =
      `${HORIZON_URL}/assets?asset_code=USDC&limit=200` +
      (cursor ? `&cursor=${cursor}` : "");
    const res = await fetch(url);
    const data = await res.json();
    const records = data._embedded.records;

    if (records.length === 0) break;

    for (const r of records) {
      const asset = new Asset(r.asset_code, r.asset_issuer);
      const contractId = asset.contractId(Networks.TESTNET);
      if (contractId === TARGET_SAC) {
        issuer = r.asset_issuer;
        break;
      }
    }
    cursor = records[records.length - 1].paging_token;
  }

  if (issuer === null) {
    console.error("Could not find USDC issuer matching SAC contract");
    process.exit(1);
  }

  console.log("Found USDC issuer:", issuer);

  // Step 2: Create trustline
  const faucetKeypair = Keypair.fromSecret(FAUCET_SECRET);
  console.log("Faucet address:", faucetKeypair.publicKey());

  const accountRes = await fetch(
    `${HORIZON_URL}/accounts/${faucetKeypair.publicKey()}`,
  );
  const accountData = await accountRes.json();
  const account = new Account(
    faucetKeypair.publicKey(),
    accountData.sequence,
  );

  const usdcAsset = new Asset("USDC", issuer);

  const tx = new TransactionBuilder(account, {
    fee: "100",
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(Operation.changeTrust({ asset: usdcAsset }))
    .setTimeout(30)
    .build();

  tx.sign(faucetKeypair);

  const submitRes = await fetch(`${HORIZON_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "tx=" + encodeURIComponent(tx.toXDR()),
  });
  const result = await submitRes.json();

  if (result.successful) {
    console.log("Trustline created! Hash:", result.hash);
    console.log("You can now send USDC to:", faucetKeypair.publicKey());
  } else {
    console.error(
      "Failed:",
      JSON.stringify(result.extras?.result_codes || result, null, 2),
    );
    process.exit(1);
  }
}

main();
