// JavaScript source code
const { ethers } = require("ethers");
const { log } = require("./logger");
const {
  RPC_URL,
  RISK_FEED_ADDRESS,
} = require("./config");

// Minimal ABI (only what we need)
const ABI = [
  "function publishRisk(address protocol,uint8 score,uint8 category,bytes32 explanationHash)"
];

// IMPORTANT:
// Use the SAME private key that deployed RiskFeed
// because publishRisk is owner-only
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  throw new Error("DEPLOYER_PRIVATE_KEY missing from env");
}

async function publishRisk({ protocol, score, category, explanation }) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const contract = new ethers.Contract(
    RISK_FEED_ADDRESS,
    ABI,
    wallet
  );

  const explanationHash = ethers.keccak256(
    ethers.toUtf8Bytes(explanation)
  );

  log("Publishing risk", { protocol, score, category });

  const tx = await contract.publishRisk(
    protocol,
    score,
    category,
    explanationHash
  );

  log("Transaction sent", { hash: tx.hash });

  await tx.wait();

  log("Transaction confirmed");
}

module.exports = { publishRisk };