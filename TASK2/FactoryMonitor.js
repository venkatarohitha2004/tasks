import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { Machine } from './Machine.js';

export class FactoryMonitor {
  constructor() {
    this.machines = [];
  }

  static validateHeaders(record) {
    const required = ['temperature', 'pressure', 'vibration'];
    const present = Object.keys(record);
    const missing = required.filter((h) => !present.includes(h));
    if (missing.length) {
      throw new Error(`CSV missing required columns: ${missing.join(', ')}`);
    }
  }

  loadFromCSV(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      if (!content || !content.trim()) {
        throw new Error('CSV file is empty');
      }

      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });

      if (!records.length) {
        throw new Error('CSV contains headers but no data rows');
      }

      FactoryMonitor.validateHeaders(records[0]);

      this.machines = [];
      records.forEach((row, idx) => {
        try {
          const temp = Number(row.temperature);
          const pressure = Number(row.pressure);
          const vibration = Number(row.vibration);

          const machine = new Machine(idx, temp, pressure, vibration);
          this.machines.push(machine);
        } catch (err) {
          const line = idx + 2; // account for header line
          console.error(`Row ${line} error: ${err.message}`);
        }
      });

      if (!this.machines.length) {
        throw new Error('No valid rows could be parsed from CSV');
      }
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`CSV file not found: ${filePath}`);
      }
      throw err;
    }
  }

  monitor() {
    this.machines.forEach((machine) => {
      const health = machine.calculateHealth();
      console.log(`Machine ${machine.id} health: ${health}`);
      if (machine.isAlert()) {
        console.log('ALERT');
      }
    });
  }
}


