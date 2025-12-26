// JavaScript source code
const { ethers } = require("ethers");
const {
  TESTNET_LIQUIDITY_POOL,
  TESTNET_LENDING_POOL,
} = require("./config");

const {
  LiquidityPoolABI,
  LendingPoolABI,
} = require("./abis/TestnetPools");

const { publishRisk } = require("./publisher");
const { log } = require("./logger");
const { computeRisk } = require("./riskModel");
const { loadState, saveState } = require("./stateStore");
const { saveExplanation } = require("./explanationStore");

const PROTOCOL = "0x1000000000000000000000000000000000000001";

async function main() {
  log("Agent starting");

  // Provider (Sepolia)
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // Read TestnetLiquidityPool
  const liquidityPool = new ethers.Contract(
    TESTNET_LIQUIDITY_POOL,
    LiquidityPoolABI,
    provider
  );

  const totalLiquidity = Number(await liquidityPool.totalLiquidity());

  // Read TestnetLendingPool
  const lendingPool = new ethers.Contract(
    TESTNET_LENDING_POOL,
    LendingPoolABI,
    provider
  );

  const deposits = Number(await lendingPool.totalDeposits());
  const borrows = Number(await lendingPool.totalBorrows());

  // Derived metrics
  const utilization = deposits === 0 ? 0 : borrows / deposits;

  // Convert to a single risk-driving metric for now (testnet-safe)
  const tvlChangePct = utilization * -10;

  const prevState = loadState(PROTOCOL);
  const result = computeRisk(tvlChangePct, prevState.stats);

  saveState(PROTOCOL, { stats: result.stats });

  const { explainWithLLM } = require("./llmExplain");

  const explanation = await explainWithLLM({
    metric: "tvlChangePct",
    value: tvlChangePct,
    mean: result.stats.mean,
    z: result.diagnostics.z,
    score: result.score
  });

  const explanationHash = saveExplanation(explanation);

  await publishRisk({
    protocol: PROTOCOL,
    score: result.score,
    category: result.category,
    explanation
  });

  console.log("Explanation used:", explanation);

  log("Agent finished run", { score: result.score });
}

main().catch((err) => {
  console.error("Agent crashed:", err);
  process.exit(1);
});