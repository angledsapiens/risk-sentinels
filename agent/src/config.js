// JavaScript source code
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return process.env[name];
}

module.exports = {
  // Network
  RPC_URL: requireEnv("RPC_URL"),

  // Contracts
  RISK_FEED_ADDRESS: requireEnv("RISK_FEED_ADDRESS"),

  // Testnet protocol addresses
  TESTNET_LIQUIDITY_POOL: requireEnv("TESTNET_LIQUIDITY_POOL"),
  TESTNET_LENDING_POOL: requireEnv("TESTNET_LENDING_POOL"),
};