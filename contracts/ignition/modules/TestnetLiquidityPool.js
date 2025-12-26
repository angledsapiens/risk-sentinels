// JavaScript source code
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TestnetLiquidityPoolModule", (m) => {
  const pool = m.contract("TestnetLiquidityPool", [1_000_000]);
  return { pool };
});