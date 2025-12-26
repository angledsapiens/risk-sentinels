// JavaScript source code
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RiskFeedModule", (m) => {
  const riskFeed = m.contract("RiskFeed");
  return { riskFeed };
});