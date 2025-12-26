# 🛡️ Risk Sentinel (AI-powered On-Chain Risk Oracle)

Risk Sentinel is an **explainable, on-chain risk oracle** powered by an off-chain agent.  
This project demonstrates a complete end-to-end pipeline where live on-chain protocol state is analyzed off-chain, scored statistically, explained via an LLM, and published back on-chain in a verifiable and replay-safe manner.

Currently deployed and tested on **Arbitrum Sepolia** with placeholder LP and Lending contracts for stress testing.

---

Risk Sentinel explores:

> **Risk as an on-chain, explainable signal** — generated off-chain, anchored on-chain, and consumable by both humans and smart contracts.

---

## 🧱 Architecture

    [TestnetLiquidityPool]      [TestnetLendingPool]
               |                        |
               |______ on-chain state __|
                           |
                           v
                    [Off-chain Agent]
            - Reads protocol state
            - Computes rolling statistics
            - Produces risk score (0–100)
            - Generates human-readable explanation (LLM)
                           |
                           v
                     [RiskFeed.sol]
            - Owner-gated publishing
            - Explanation hash anchored on-chain
            - Emits RiskPublished events
                           |
                           v
                  [Listener / Indexer]
            - Subscribes to events
            - Replay-safe (txHash + logIndex)
            - Resolves explanation from hash

---

## 🔗 Deployed Contracts (Arbitrum Sepolia)

The following contracts are deployed on **Arbitrum Sepolia**:

- **RiskFeed**
  - Owner-gated oracle contract
  - Stores the latest risk report per protocol
  - Emits `RiskPublished` events

- **TestnetLiquidityPool**
  - Mock liquidity pool
  - Simulates TVL changes and liquidity stress

- **TestnetLendingPool**
  - Mock lending pool
  - Simulates utilization pressure (borrows / deposits)

Contract addresses are injected via environment variables and are configurable.

---

## 🤖 Off-Chain Agent Responsibilities

The Risk Sentinel agent:

1. Reads live on-chain state from deployed protocol contracts
2. Computes rolling statistics (mean, variance, z-score)
3. Derives a bounded risk score (0–100)
4. Generates a human-readable explanation using an LLM
5. Hashes the explanation and publishes the score on-chain

**Design choices**

- The agent signs transactions using the **RiskFeed owner key**
- This preserves strict access control without delegated publishers
- In production, owner and publisher roles would be separated

---

## 📡 Listener Responsibilities

The listener acts as a lightweight indexer:

- Subscribes to `RiskPublished` events
- Deduplicates events using `(transactionHash + logIndex)`
- Resolves explanation hashes to stored explanations
- Outputs human-readable risk updates

Replay safety reflects OP-stack behavior.

---

## 🧪 What This Demonstrates

- ✅ Owner-gated on-chain risk publishing  
- ✅ Off-chain statistical risk modeling  
- ✅ Explainability anchored on-chain via hash  
- ✅ LLM-assisted narrative generation  
- ✅ Replay-safe event consumption  
- ✅ Clear trust boundary between agent and contract   

---

## 🚫 Out of Scope (For now)

This does **not** include:

- Capital deployment
- Automated parameter changes
- DAO governance hooks
- Production persistence layers
- Multi-publisher authorization
- Slashing or incentive mechanisms

This will be addressed on an on-going basis in future sprints (if possible)

---

## 🧠 Design Philosophy

- Explainability  
- On-chain anchoring  
  
---

## 🔮 Future Extensions

- Delegated publishers
- Oracle price volatility feeds
- Multi-protocol aggregation
- DAO/User-governed risk thresholds
- Contract-consumable risk hooks
- Mainnet deployment

---

## 📄 License

MIT

---
