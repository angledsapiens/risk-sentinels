// JavaScript source code
const { updateEWMA, zScore } = require("./stats");

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function computeRisk(metricValue, prevStats) {
  const stats = updateEWMA(prevStats, metricValue);
  const z = zScore(metricValue, stats);

  // Negative anomalies = risk
  const risk01 = sigmoid(-z);
  const score = Math.round(risk01 * 100);

  return {
    score,
    category: 1, // LIQUIDITY
    stats,
    diagnostics: { z }
  };
}

module.exports = {
  computeRisk
};