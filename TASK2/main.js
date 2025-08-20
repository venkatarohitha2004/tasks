import { FactoryMonitor } from './FactoryMonitor.js';

const filePath = process.argv[2] || 'machines.csv';

const monitor = new FactoryMonitor();

try {
  monitor.loadFromCSV(filePath);
  monitor.monitor();
} catch (err) {
  console.error(`Monitoring failed: ${err.message}`);
  process.exitCode = 1;
}


