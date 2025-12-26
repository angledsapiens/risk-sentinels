// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract TestnetLendingPool {
    uint256 public totalDeposits;
    uint256 public totalBorrows;

    event LendingStateUpdated(
        uint256 deposits,
        uint256 borrows,
        uint256 timestamp
    );

    constructor(uint256 initialDeposits) {
        totalDeposits = initialDeposits;
        emit LendingStateUpdated(totalDeposits, totalBorrows, block.timestamp);
    }

    function deposit(uint256 amount) external {
        totalDeposits += amount;
        emit LendingStateUpdated(totalDeposits, totalBorrows, block.timestamp);
    }

    function borrow(uint256 amount) external {
        require(totalBorrows + amount <= totalDeposits, "insufficient liquidity");
        totalBorrows += amount;
        emit LendingStateUpdated(totalDeposits, totalBorrows, block.timestamp);
    }

    function repay(uint256 amount) external {
        require(amount <= totalBorrows, "repay too much");
        totalBorrows -= amount;
        emit LendingStateUpdated(totalDeposits, totalBorrows, block.timestamp);
    }
}