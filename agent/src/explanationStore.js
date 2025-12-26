// JavaScript source code
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const EXPLAIN_DIR = path.join(__dirname, "..", "..", "explanations");

function ensureDir() {
  if (!fs.existsSync(EXPLAIN_DIR)) {
    fs.mkdirSync(EXPLAIN_DIR);
  }
}

function hashExplanation(text) {
  return ethers.keccak256(ethers.toUtf8Bytes(text));
}

function saveExplanation(text) {
  ensureDir();
  const hash = hashExplanation(text);
  const file = path.join(EXPLAIN_DIR, `${hash}.json`);

  if (!fs.existsSync(file)) {
    fs.writeFileSync(
      file,
      JSON.stringify(
        {
          hash,
          text,
          createdAt: new Date().toISOString()
        },
        null,
        2
      )
    );
  }

  return hash;
}

function loadExplanation(hash) {
  const file = path.join(EXPLAIN_DIR, `${hash}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")).text;
}

module.exports = {
  saveExplanation,
  loadExplanation,
  hashExplanation
};