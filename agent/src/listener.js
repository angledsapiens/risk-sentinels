// JavaScript source code
const { ethers } = require("ethers");
const { log } = require("./logger");
const { RPC_URL, RISK_FEED_ADDRESS } = require("./config");
const { loadExplanation } = require("./explanationStore");

// Minimal ABI for listening
const ABI = [
  "event RiskPublished(address indexed protocol,uint8 score,uint8 category,bytes32 explanationHash,uint256 timestamp)"
];

// Provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Contract
const contract = new ethers.Contract(
  RISK_FEED_ADDRESS,
  ABI,
  provider
);

// Dedup cache: txHash:logIndex
const seenEvents = new Set();
const MAX_CACHE_SIZE = 500;

log("Starting RiskFeed event listener");
log("Listener active — waiting for events...");

contract.on(
  "RiskPublished",
  async (protocol, score, category, explanationHash, timestamp, event) => {
    try {
      const dedupKey = `${event.transactionHash}:${event.logIndex}`;

      // Ignore replayed logs
      if (seenEvents.has(dedupKey)) {
        return;
      }

      seenEvents.add(dedupKey);

      // Prevent unbounded memory growth
      if (seenEvents.size > MAX_CACHE_SIZE) {
        const firstKey = seenEvents.values().next().value;
        seenEvents.delete(firstKey);
      }

      log("RiskPublished event received", {
        protocol,
        score,
        category,
        explanationHash,
        timestamp,
      });

      const explanation = loadExplanation(explanationHash);

      log("Resolved explanation", { explanation });

    } catch (err) {
      console.error("Listener error:", err);
    }
  }
);