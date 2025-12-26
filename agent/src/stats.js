// JavaScript source code
const ALPHA = 0.2; // responsiveness (0.1–0.3 is sane)

function updateEWMA(prev, value) {
  if (!prev) {
    return { mean: value, variance: 0 };
  }

  const mean = ALPHA * value + (1 - ALPHA) * prev.mean;
  const variance =
    ALPHA * Math.pow(value - mean, 2) + (1 - ALPHA) * prev.variance;

  return { mean, variance };
}

function zScore(value, stats) {
  const std = Math.sqrt(stats.variance) || 1e-6;
  return (value - stats.mean) / std;
}

module.exports = {
  updateEWMA,
  zScore
};