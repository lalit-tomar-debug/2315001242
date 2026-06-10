const axios = require('axios');
const logger = require('../logging_middleware/logger');

const BASE_URL = 'http://4.224.186.213/evaluation-service';
const AUTH_TOKEN = 'RPsgYt';

const headers = { Authorization: `Bearer ${AUTH_TOKEN}` };

async function fetchDepots() {
  logger.info('Fetching depots from API');
  const res = await axios.get(`${BASE_URL}/depots`, { headers });
  logger.info('Depots fetched', { count: res.data.depots.length });
  return res.data.depots;
}

async function fetchVehicles() {
  logger.info('Fetching vehicles from API');
  const res = await axios.get(`${BASE_URL}/vehicles`, { headers });
  logger.info('Vehicles fetched', { count: res.data.vehicles.length });
  return res.data.vehicles;
}

// 0/1 Knapsack — maximize Impact within MechanicHours budget
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

  // Backtrack to find which tasks were selected
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
    const [depots, vehicles] = await Promise.all([
      fetchDepots(),
      fetchVehicles(),
    ]);

    console.log('\n======= VEHICLE MAINTENANCE SCHEDULER =======\n');

    for (const depot of depots) {
      logger.info(`Running scheduler for depot ${depot.ID}`, {
        budget: depot.MechanicHours,
      });

      const result = knapsack(vehicles, depot.MechanicHours);

      logger.info(`Result for depot ${depot.ID}`, {
        totalImpact: result.totalImpact,
        hoursUsed: result.totalDuration,
        tasksSelected: result.selectedTasks.length,
      });

      console.log(`--- Depot ${depot.ID} | Budget: ${depot.MechanicHours}h ---`);
      console.log(`Max Impact: ${result.totalImpact} | Hours Used: ${result.totalDuration}`);
      console.log(`Tasks selected (${result.selectedTasks.length}):`);
      result.selectedTasks.forEach((t) => {
        console.log(`  TaskID: ${t.TaskID} | Duration: ${t.Duration}h | Impact: ${t.Impact}`);
      });
      console.log('');
    }

  } catch (err) {
    logger.error('Scheduler failed', { error: err.message });
    console.error('Error:', err.message);
  }
}

main();