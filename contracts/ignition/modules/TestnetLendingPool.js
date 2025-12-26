// JavaScript source code
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TestnetLendingPoolModule", (m) => {
  const pool = m.contract("TestnetLendingPool", [1_000_000]);
  return { pool };
});