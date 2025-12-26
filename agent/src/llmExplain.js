// JavaScript source code
let OpenAI;
try {
  OpenAI = require("openai");
} catch (_) {
  // optional dependency
}

const USE_LLM = !!process.env.OPENAI_API_KEY;

/**
 * Deterministic fallback explanation
 */
function fallbackExplanation({ metric, value, z, score }) {
  return (
    `Metric ${metric} observed value ${value.toFixed(2)} ` +
    `(z=${z.toFixed(2)}), resulting in risk score ${score}.`
  );
}

/**
 * LLM-based explanation (interpretation only)
 */
async function explainWithLLM({ metric, value, mean, z, score }) {
  if (!USE_LLM || !OpenAI) {
    return fallbackExplanation({ metric, value, z, score });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
You are explaining an on-chain risk signal to a DAO operator.

Metric: ${metric}
Current value: ${value}
Rolling mean: ${mean}
Z-score: ${z}
Risk score (0-100): ${score}

Explain in ONE concise sentence why this risk score was produced.
No speculation. No advice.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    return fallbackExplanation({ metric, value, z, score });
  }
}

module.exports = {
  explainWithLLM
};