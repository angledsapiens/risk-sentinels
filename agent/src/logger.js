// JavaScript source code
function log(msg, data = {}) {
  const time = new Date().toISOString();
  console.log(`[${time}] ${msg}`, data);
}

module.exports = { log };