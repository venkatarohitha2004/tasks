// main.js
const fs = require("fs");
const { Worker } = require("worker_threads");
const FactoryMonitor = require("./Factorymonitor"); // lowercase f
const monitor = new FactoryMonitor();

// ======== 1) Synchronous sensor update ========
function syncSensorUpdate(count = 100) {
  const start = process.hrtime.bigint();
  for (let i = 0; i < count; i++) {
    monitor.addSensorToMachine("M1", { id: `T${i}`, type: "Temperature", value: 80 + (i % 20) });
  }
  const end = process.hrtime.bigint();
  console.log(`Synchronous update time: ${(end - start) / 1_000_000n}ms`);
}

// ======== 2) Batched async updates ========
async function asyncSensorUpdateBatched(total = 100, batchSize = 20) {
  const start = process.hrtime.bigint();
  for (let startIdx = 0; startIdx < total; startIdx += batchSize) {
    const endIdx = Math.min(startIdx + batchSize, total);
    for (let i = startIdx; i < endIdx; i++) {
      monitor.addSensorToMachine("M2", { id: `P${i}`, type: "Pressure", value: 90 + (i % 15) });
    }
    await new Promise((resolve) => setImmediate(resolve));
  }
  const end = process.hrtime.bigint();
  console.log(`Async (batched) update time: ${(end - start) / 1_000_000n}ms`);
}

// ======== 3) Real-time updates ========
function startRealtimeUpdates(iterations = 10, periodMs = 200) {
  let count = 0;
  const intervalId = setInterval(() => {
    const temp = 80 + Math.random() * 30;
    const press = 90 + Math.random() * 20;
    const vib = Math.random() * 100;

    monitor.addSensorToMachine("M3", { id: `T${count}`, type: "Temperature", value: temp });
    monitor.addSensorToMachine("M3", { id: `P${count}`, type: "Pressure", value: press });
    monitor.addSensorToMachine("M3", { id: `V${count}`, type: "Vibration", value: vib });

    count++;
    if (count >= iterations) {
      clearInterval(intervalId);
      console.log("Real-time sensor updates complete.");
      monitor.report();
    }
  }, periodMs);
}

// ======== 4) Worker thread ========
function runWorker() {
  try {
    const worker = new Worker(require.resolve("./workerTask.js"));
    worker.on("message", (msg) => console.log("Worker:", msg));
    worker.on("error", (err) => console.error("Worker error:", err.message || err));
    worker.on("exit", (code) => {
      if (code !== 0) console.error(`Worker exited with code: ${code}`);
    });
  } catch (err) {
    console.error("Failed to start worker:", err.message || err);
  }
}

// ======== 5) Optional CSV load ========
async function tryLoadCSV(filePath = "data.csv") {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`CSV not found (${filePath}) — skipping CSV load.`);
      return;
    }
    monitor.loadFromCSV(filePath); // instance method
    monitor.report();
  } catch (err) {
    console.error("CSV load failed:", err.message || err);
  }
}

// ======== Main sequence ========
(async () => {
  syncSensorUpdate();
  await asyncSensorUpdateBatched();
  console.log("Performance comparison complete.");

  startRealtimeUpdates();
  runWorker();
  await tryLoadCSV("data.csv");
})();
