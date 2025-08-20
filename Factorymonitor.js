// factoryMonitor.js
const fs = require("fs");

// ======== Configuration ========
const SAFE_LIMITS = {
  Temperature: { min: 0, max: 120 },
  Pressure: { min: 30, max: 250 },
  Vibration: { min: 0, max: 100 },
};

// ======== Utility Functions ========
function calculateStats(values) {
  if (!values || values.length === 0) {
    return { avg: 0, min: 0, max: 0 };
  }
  const sum = values.reduce((a, b) => a + b, 0);
  return { avg: sum / values.length, min: Math.min(...values), max: Math.max(...values) };
}

function calculateHealth(machine) {
  if (!machine.sensors || machine.sensors.length === 0) return 0;

  // Compute health based on deviation from safe max
  let score = 100;
  for (const sensor of machine.sensors) {
    const limits = SAFE_LIMITS[sensor.type];
    if (!limits) continue;

    if (sensor.value > limits.max) score -= 40;
    else if (sensor.value > limits.max * 0.9) score -= 20;

    if (sensor.value < limits.min) score -= 40;
    else if (sensor.value < limits.min + (limits.max - limits.min) * 0.1) score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

function generateAlerts(machine) {
  const alerts = [];
  for (const sensor of machine.sensors) {
    const limits = SAFE_LIMITS[sensor.type];
    if (!limits) continue;

    if (sensor.value > limits.max)
      alerts.push(`${sensor.type} too high (reading ${sensor.value}, max ${limits.max})`);
    else if (sensor.value < limits.min)
      alerts.push(`${sensor.type} too low (reading ${sensor.value}, min ${limits.min})`);
    else if (sensor.value > limits.max * 0.9)
      alerts.push(`${sensor.type} slightly high (reading ${sensor.value})`);
    else if (sensor.value < limits.min + (limits.max - limits.min) * 0.1)
      alerts.push(`${sensor.type} slightly low (reading ${sensor.value})`);
  }
  if (alerts.length === 0) alerts.push("✅ All sensors normal");
  return alerts;
}

// ======== Core Class ========
class FactoryMonitor {
  constructor() {
    this.machines = {};
  }

  // ===== Add a sensor dynamically =====
  addSensorToMachine(machineId, sensor) {
    if (!this.machines[machineId]) {
      this.machines[machineId] = { id: machineId, sensors: [] };
    }
    this.machines[machineId].sensors.push(sensor);
  }

  // ===== Load CSV =====
  loadFromCSV(filePath) {
    if (!fs.existsSync(filePath)) throw new Error("CSV file not found");
    const data = fs.readFileSync(filePath, "utf8").trim().split("\n");
    const header = data.shift(); // remove header row

    for (const line of data) {
      const [machineId, sensorId, type, reading] = line.split(",").map(x => x.trim());
      const value = parseFloat(reading);
      if (!machineId || !sensorId || !type || isNaN(value)) continue;

      this.addSensorToMachine(machineId, { id: sensorId, type, value });
    }
    console.log("=== CSV Load Report ===");
  }

  // ===== Report =====
  report() {
    console.log("\n=== Factory Status Report ===\n");
    let totalHealth = 0;
    let machineCount = 0;

    for (const machineId of Object.keys(this.machines)) {
      const machine = this.machines[machineId];
      const values = machine.sensors.map(s => s.value).filter(v => !isNaN(v));
      const stats = calculateStats(values);
      const health = calculateHealth(machine);
      const alerts = generateAlerts(machine);

      console.log(`Machine ${machine.id}:`);
      console.log(`  Total Sensors      : ${machine.sensors.length}`);
      console.log(`  Health Score       : ${health.toFixed(2)}`);
      console.log(`  Avg Sensor Reading : ${stats.avg.toFixed(2)}`);
      console.log(`  Max Reading        : ${stats.max.toFixed(2)}`);
      console.log(`  Min Reading        : ${stats.min.toFixed(2)}`);
      for (const alert of alerts) {
        if (!alert.startsWith("✅")) console.log(`   ⚠️ Alert: ${alert}`);
      }
      console.log("");

      totalHealth += health;
      machineCount++;
    }

    const avgHealth = machineCount > 0 ? totalHealth / machineCount : 0;
    console.log(`Average Health (CSV): ${avgHealth.toFixed(2)}`);
  }
}

module.exports = FactoryMonitor;
