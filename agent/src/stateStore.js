// JavaScript source code
const fs = require("fs");
const path = require("path");

const STATE_DIR = path.join(__dirname, "..", "..", "state");

function loadState(protocol) {
  const file = path.join(STATE_DIR, `${protocol}.json`);
  if (!fs.existsSync(file)) return {};
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveState(protocol, state) {
  if (!fs.existsSync(STATE_DIR)) {
    fs.mkdirSync(STATE_DIR);
  }
  const file = path.join(STATE_DIR, `${protocol}.json`);
  fs.writeFileSync(file, JSON.stringify(state, null, 2));
}

module.exports = {
  loadState,
  saveState
};