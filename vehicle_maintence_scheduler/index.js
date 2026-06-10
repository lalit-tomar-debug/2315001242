const axios = require('axios');
const { Log, ACCESS_TOKEN } = require('../logging_middleware/logger');

const BASE_URL = 'http://4.224.186.213/evaluation-service';
const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` };

async function fetchDepots() {
  await Log('backend', 'info', 'service', 'Fetching depots');
  const res = await axios.get(`${BASE_URL}/depots`, { headers });
  await Log('backend', 'info', 'service', `Depots fetched: ${res.data.depots.length}`);
  return res.data.depots;
}

async function fetchVehicles() {
  await Log('backend', 'info', 'service', 'Fetching vehicles');
  const res = await axios.get(`${BASE_URL}/vehicles`, { headers });
  await Log('backend', 'info', 'service', `Vehicles fetched: ${res.data.vehicles.length}`);
  return res.data.vehicles;
}

function knapsack(tasks, budget) {
  const n = tasks.length;
  const dp = Array.from({ length: n + 1 }, () => Array(budget + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    const { Duration, Impact } = tasks[i - 1];
    for (let w = 0; w <= budget; w++) {
      dp[i][w] = dp[i - 1][w];
      if (Duration <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i - 1][w - Duration] + Impact);
      }
    }
  }
  let w = budget;
  const selected = [];
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(tasks[i - 1]);
      w -= tasks[i - 1].Duration;
    }
  }
  return {
    selectedTasks: selected,
    totalImpact: dp[n][budget],
    totalDuration: selected.reduce((sum, t) => sum + t.Duration, 0),
  };
}

async function main() {
  try {
    await Log('backend', 'info', 'handler', 'Scheduler started');
    const [depots, vehicles] = await Promise.all([
      fetchDepots(),
      fetchVehicles(),
    ]);

    console.log('\n====== VEHICLE MAINTENANCE SCHEDULER ======\n');

    for (const depot of depots) {
      await Log('backend', 'info', 'domain', `Processing depot ${depot.ID}`);
      const result = knapsack(vehicles, depot.MechanicHours);
      await Log('backend', 'info', 'domain', `Depot ${depot.ID} impact: ${result.totalImpact}`);

      console.log(`--- Depot ${depot.ID} | Budget: ${depot.MechanicHours}h ---`);
      console.log(`Max Impact: ${result.totalImpact} | Hours Used: ${result.totalDuration}`);
      console.log(`Tasks selected: ${result.selectedTasks.length}`);
      result.selectedTasks.forEach(t => {
        console.log(`  TaskID: ${t.TaskID} | Duration: ${t.Duration}h | Impact: ${t.Impact}`);
      });
      console.log('');
    }

    await Log('backend', 'info', 'handler', 'Scheduler completed');
  } catch (err) {
    await Log('backend', 'error', 'handler', `Scheduler error: ${err.message}`.slice(0, 48));
    console.error('Error:', err.message);
  }
}

main();