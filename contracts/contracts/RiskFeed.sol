// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract RiskFeed {
    enum RiskCategory {
        UNKNOWN,
        LIQUIDITY,
        ORACLE,
        GOVERNANCE,
        VOLATILITY
    }

    struct RiskReport {
        uint8 score;              // 0–100
        RiskCategory category;
        bytes32 explanationHash;  // keccak256(explanation)
        uint256 timestamp;
    }

    address public owner;

    mapping(address => RiskReport) public latestReport;

    event RiskPublished(
        address indexed protocol,
        uint8 score,
        RiskCategory category,
        bytes32 explanationHash,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function publishRisk(
        address protocol,
        uint8 score,
        RiskCategory category,
        bytes32 explanationHash
    ) external onlyOwner {
        require(score <= 100, "invalid score");

        latestReport[protocol] = RiskReport({
            score: score,
            category: category,
            explanationHash: explanationHash,
            timestamp: block.timestamp
        });

        emit RiskPublished(
            protocol,
            score,
            category,
            explanationHash,
            block.timestamp
        );
    }
}