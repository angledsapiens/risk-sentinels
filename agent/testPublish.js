// JavaScript source code
const dotenv = require("dotenv");
const { ethers } = require("ethers");

dotenv.config({ path: "../.env" });

async function main() {
  const rpcUrl = process.env.LOCAL_RPC;
  const contractAddress = process.env.RISK_FEED_ADDRESS;

  if (!rpcUrl || !contractAddress) {
    throw new Error("Missing LOCAL_RPC or RISK_FEED_ADDRESS in .env");
  }

  // Connect to local Hardhat node
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  // Use first Hardhat account (deterministic private key)
  const privateKey =
    "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  const wallet = new ethers.Wallet(privateKey, provider);

  // Minimal ABI for publishRisk
  const abi = [
    "function publishRisk(address protocol,uint8 score,uint8 category,bytes32 explanationHash)"
  ];

  const riskFeed = new ethers.Contract(contractAddress, abi, wallet);

  const protocol = "0x1000000000000000000000000000000000000001";
  const score = 55;
  const category = 1; // LIQUIDITY
  const explanation = "manual test risk publish";

  const explanationHash = ethers.keccak256(
    ethers.toUtf8Bytes(explanation)
  );

  console.log("Submitting publishRisk tx...");

  const tx = await riskFeed.publishRisk(
    protocol,
    score,
    category,
    explanationHash
  );

  console.log("TX hash:", tx.hash);

  await tx.wait();

  console.log("✅ publishRisk transaction confirmed");
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});