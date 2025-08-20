// workerTask.js
const fs = require("fs");
const csv = require("csv-parser");
const { parentPort, workerData } = require("worker_threads");
const Sensor = require("./sensor");

(async () => {
  try {
    const results = {};
    fs.createReadStream(workerData.path)
      .pipe(csv())
      .on("data", row => {
        const machineId = row.machineId;
        if (!results[machineId]) results[machineId] = [];
        results[machineId].push(
          new Sensor(row.type, parseFloat(row.reading))
        );
      })
      .on("end", () => {
        parentPort.postMessage(results);
      });
  } catch (err) {
    parentPort.postMessage({ error: err.message });
  }
})();
