// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TestnetLiquidityPool {
    uint256 public totalLiquidity;

    event LiquidityUpdated(
        uint256 newLiquidity,
        int256 delta,
        uint256 timestamp
    );

    constructor(uint256 initialLiquidity) {
        totalLiquidity = initialLiquidity;
        emit LiquidityUpdated(initialLiquidity, int256(initialLiquidity), block.timestamp);
    }

    function deposit(uint256 amount) external {
        totalLiquidity += amount;
        emit LiquidityUpdated(totalLiquidity, int256(amount), block.timestamp);
    }

    function withdraw(uint256 amount) external {
        require(amount <= totalLiquidity, "insufficient liquidity");
        totalLiquidity -= amount;
        emit LiquidityUpdated(totalLiquidity, -int256(amount), block.timestamp);
    }

    // TESTNET ONLY — simulate shocks
    function forceShock(int256 delta) external {
        if (delta < 0) {
            uint256 abs = uint256(-delta);
            require(abs <= totalLiquidity, "shock too large");
            totalLiquidity -= abs;
        } else {
            totalLiquidity += uint256(delta);
        }
        emit LiquidityUpdated(totalLiquidity, delta, block.timestamp);
    }
}