const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "app.log");

function log(level, message, data = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
  };
  const line = JSON.stringify(entry) + "\n";
  fs.appendFileSync(logFile, line);
  console.log(`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`, data);
}

const logger = {
  info: (msg, data) => log("info", msg, data),
  error: (msg, data) => log("error", msg, data),
  warn: (msg, data) => log("warn", msg, data),
};

module.exports = logger;
