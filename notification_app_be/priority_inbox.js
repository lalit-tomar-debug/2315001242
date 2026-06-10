const axios = require("axios");
const { Log, ACCESS_TOKEN } = require("../logging_middleware/logger");

const BASE_URL = "http://4.224.186.213/evaluation-service";
const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` };
const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

async function fetchNotifications() {
  await Log("backend", "info", "service", "Fetching notifications from API");
  const res = await axios.get(`${BASE_URL}/notifications`, { headers });
  await Log(
    "backend",
    "info",
    "service",
    `Notifications fetched: ${res.data.notifications.length}`,
  );
  return res.data.notifications;
}

function getPriorityScore(notif) {
  const typeWeight = TYPE_WEIGHT[notif.Type] || 1;
  const ageHours =
    (Date.now() - new Date(notif.Timestamp).getTime()) / (1000 * 60 * 60);
  const recencyScore = 1 / (1 + ageHours);
  return typeWeight * 10 + recencyScore;
}

async function getTopN(n = 10) {
  try {
    await Log(
      "backend",
      "info",
      "handler",
      `Getting top ${n} priority notifications`,
    );
    const notifications = await fetchNotifications();
    const scored = notifications.map((notif) => ({
      ...notif,
      score: getPriorityScore(notif),
    }));
    scored.sort((a, b) => b.score - a.score);
    const topN = scored.slice(0, n);
    await Log(
      "backend",
      "info",
      "handler",
      `Top ${n} notifications calculated successfully`,
    );
    console.log(`\n===== TOP ${n} PRIORITY NOTIFICATIONS =====\n`);
    topN.forEach((notif, i) => {
      console.log(
        `${i + 1}. [${notif.Type}] "${notif.Message}" | Score: ${notif.score.toFixed(3)} | Time: ${notif.Timestamp}`,
      );
    });
    return topN;
  } catch (err) {
    await Log(
      "backend",
      "error",
      "handler",
      `Priority inbox failed: ${err.message}`,
    );
    console.error("Error:", err.message);
  }
}

getTopN(10);
