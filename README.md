# Factory Monitoring Project

## Overview
This project monitors factory machines using sensor data to assess machine health and generate alerts for critical risks and sensor issues. It processes CSV data, calculates health scores, and provides warnings for offline sensors and machines at risk of failure.

## Features
- Reads sensor data from a CSV file
- Calculates machine health based on temperature, pressure, and vibration
- Alerts for critical machine failure risk (health < 50)
- Alerts for missing/ offline sensors
- Computes average health across all machines
- Unit tests using Jest

## File Structure
- `main.js` — Entry point; reads CSV and generates health report
- `machine.js` — Machine class; health calculation and alert logic
- `sensor.js` — Sensor class; represents individual sensors
- `Factorymonitor.js` — FactoryMonitor class; manages machines and reporting
- `data.csv` — Example sensor data
- `test/factory.jest.test.js` — Jest unit tests

## Health Calculation Logic
- Start at 100
- Subtract 30 if Temperature > 100
- Subtract 30 if Pressure < 40
- Subtract 40 if Vibration > 70
- If any required sensor is missing, health is 0 and warning is "Sensor Offline Warning"
- If health < 50, warning is "Critical Machine Failure Risk"


## Getting Started
1. Install dependencies:
   ```
   npm install
   ```
2. Run the main program:
   ```
   node main.js
   ```
3. Run unit tests:
   ```
   npx jest
   ```

## Real-Time & Multi-Threaded Simulation

- **Real-time sensor updates**: Implemented in `main.js` using `setInterval` to simulate live sensor data.
- **Async vs Sync performance**: Both synchronous and asynchronous sensor update functions are included in `main.js` for performance comparison.
- **Worker Threads**: Multi-threaded simulation using Node.js Worker Threads is demonstrated in `main.js` for heavy computation offloading.

See comments in `main.js` for where each feature is implemented.

## Example CSV Format
```
MachineID,SensorID,Type,Reading
M1,S1,Temperature,120
M1,S2,Pressure,30
M1,S3,Vibration,80
```

## License
MIT
